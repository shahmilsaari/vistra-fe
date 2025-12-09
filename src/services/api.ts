import { getToken, clearToken } from "@/lib/session";

export const API_BASE_URL = (() => {
  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
  return rawBase.replace(/\/+$/, "");
})();

type RequestOptions = RequestInit & { signal?: AbortSignal };

// Global logout handler - will be set by the auth provider
let globalLogoutHandler: (() => void) | null = null;

type ApiEnvelope<T> = {
  data: T;
  // Allow other keys so envelopes with meta are not treated as plain data responses.
  [key: string]: unknown;
};

export function setGlobalLogoutHandler(handler: () => void) {
  globalLogoutHandler = handler;
}

const unwrapResponse = <T>(payload: unknown): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Object.keys(payload as Record<string, unknown>).length === 1
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

const coerceMeta = (meta: unknown, count = 0): PaginatedAttachments["meta"] => {
  if (
    meta &&
    typeof meta === "object" &&
    "totalCount" in meta &&
    "totalPages" in meta &&
    "page" in meta &&
    "limit" in meta
  ) {
    const cast = meta as PaginatedAttachments["meta"];
    return {
      totalCount: Number(cast.totalCount) || 0,
      totalPages: Number(cast.totalPages) || 1,
      page: Number(cast.page) || 1,
      limit: Number(cast.limit) || count || 0,
    };
  }

  return {
    totalCount: count,
    totalPages: 1,
    page: 1,
    limit: count,
  };
};

export const normalizePaginatedAttachments = (payload: unknown): PaginatedAttachments => {
  if (!payload || typeof payload !== "object") {
    return { data: [], directories: [], meta: coerceMeta(null, 0) };
  }

  const base = payload as Record<string, unknown>;
  const topData = base.data;
  const directories = Array.isArray(base.directories) ? (base.directories as DirectoryItem[]) : undefined;

  if (Array.isArray(topData)) {
    return {
      data: topData as AttachmentItem[],
      directories: directories ?? [],
      meta: coerceMeta(base.meta, topData.length),
    };
  }

  if (topData && typeof topData === "object") {
    const nested = topData as Record<string, unknown>;
    const nestedData = nested.data;
    const nestedDirs = Array.isArray(nested.directories)
      ? (nested.directories as DirectoryItem[])
      : directories ?? [];

    if (Array.isArray(nestedData)) {
      return {
        data: nestedData as AttachmentItem[],
        directories: nestedDirs,
        meta: coerceMeta(nested.meta ?? base.meta, nestedData.length),
      };
    }
  }

  return {
    data: [],
    directories: directories ?? [],
    meta: coerceMeta(base.meta, 0),
  };
};

const normalizePaginatedRemarks = (payload: unknown): PaginatedRemarksDto => {
  const empty: PaginatedRemarksDto = {
    data: [],
    meta: { totalCount: 0, totalPages: 1, page: 1, limit: 0 },
  };

  if (!payload || typeof payload !== "object") {
    return empty;
  }

  const base = payload as Record<string, unknown>;
  const topData = base.data;

  const buildMeta = (metaSource: unknown, count: number): PaginatedRemarksDto["meta"] => {
    if (
      metaSource &&
      typeof metaSource === "object" &&
      "totalCount" in metaSource &&
      "totalPages" in metaSource &&
      "page" in metaSource &&
      "limit" in metaSource
    ) {
      const cast = metaSource as PaginatedRemarksDto["meta"];
      return {
        totalCount: Number(cast.totalCount) || count,
        totalPages: Number(cast.totalPages) || 1,
        page: Number(cast.page) || 1,
        limit: Number(cast.limit) || count,
      };
    }
    return { ...empty.meta, totalCount: count, limit: count };
  };

  if (Array.isArray(topData)) {
    return {
      data: topData as RemarkItemDto[],
      meta: buildMeta(base.meta, topData.length),
    };
  }

  if (topData && typeof topData === "object") {
    const nested = topData as Record<string, unknown>;
    const nestedData = nested.data;

    if (Array.isArray(nestedData)) {
      return {
        data: nestedData as RemarkItemDto[],
        meta: buildMeta(nested.meta ?? base.meta, nestedData.length),
      };
    }
  }

  return empty;
};

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanedPath}`;
  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      credentials: init.credentials ?? "include",
      headers,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new Error("Unable to reach the API. Please try again.");
  }

  // Handle 401 Unauthorized - trigger automatic logout
  if (response.status === 401) {
    clearToken();
    if (globalLogoutHandler) {
      globalLogoutHandler();
    }
    throw new Error("Your session has expired. Please log in again.");
  }

  const payload = await response.json().catch(() => null);
  const body = unwrapResponse<T>(payload);

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? response.statusText ?? "An unknown error occurred";
    throw new Error(message);
  }

  return body as T;
}

export interface AttachmentItem {
  id: number;
  name: string;
  kind: string;
  size: number;
  mime: string;
  storageKey: string;
  storageUrl: string;
  path: string | {
    id: number;
    name: string;
    parentId?: number;
  };
  owner: {
    id: number;
    name: string;
    email: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryItem {
  name: string;
  path: string;
  diskPath: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaginatedAttachments {
  directories?: DirectoryItem[];
  data: AttachmentItem[];
  meta: {
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface FetchAttachmentsOptions {
  limit?: number;
  page?: number;
  signal?: AbortSignal;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pathId?: number;
  search?: string;
  folder?: string;
}

export async function fetchAttachments(options: FetchAttachmentsOptions = {}): Promise<PaginatedAttachments> {
  const query = new URLSearchParams();
  if (options.limit) {
    query.set("limit", options.limit.toString());
  }
  if (options.page) {
    query.set("page", options.page.toString());
  }

  if (options.sortBy) {
    query.set("sortBy", options.sortBy);
  }

  if (options.sortOrder) {
    query.set("sortOrder", options.sortOrder);
  }

  if (options.pathId) {
    query.set("pathId", options.pathId.toString());
  }

  if (options.search) {
    query.set("search", options.search);
  }

  if (options.folder) {
    query.set("folder", options.folder);
  }

  const queryString = query.toString();

  return request<PaginatedAttachments>(`/attachments${queryString ? `?${queryString}` : ""}`, {
    signal: options.signal,
  }).then(normalizePaginatedAttachments);
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthPayload {
  accessToken?: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

type RawAuthPayload = {
  accessToken?: string;
  token?: string;
  access_token?: string;
  user?: Partial<AuthPayload["user"]>;
  data?: RawAuthPayload;
  [key: string]: unknown;
};

const normalizeAuthPayload = (raw: unknown): AuthPayload => {
  const envelope = (raw ?? {}) as RawAuthPayload;
  const inner = envelope.data ?? envelope;

  const token = inner.accessToken ?? inner.token ?? inner.access_token;
  const rawUser = inner.user ?? inner.data?.user ?? inner.data;

  if (!rawUser || typeof rawUser !== "object") {
    throw new Error("Invalid login response from server: missing user data.");
  }

  const user = {
    id: Number(rawUser.id) || 0,
    email: rawUser.email ?? "",
    name: rawUser.name ?? rawUser.email ?? "User",
    role: rawUser.role ?? "",
  };

  return token ? { accessToken: token, user } : { user };
};

export async function login(credentials: Credentials): Promise<AuthPayload> {
  return request<unknown>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then(normalizeAuthPayload);
}

export async function logout(): Promise<void> {
  await request<void>("/auth/logout", {
    method: "POST",
  });
}

export interface UploadAttachmentsOptions {
  files: File[];
  folder?: string;
  name?: string;
}

type AttachmentUploadResponse = AttachmentItem[] | { data?: AttachmentItem[] };

const isAttachmentDataEnvelope = (value: AttachmentUploadResponse): value is { data: AttachmentItem[] } =>
  !Array.isArray(value) && !!value && typeof value === "object" && Array.isArray(value.data);

export async function uploadAttachment(options: UploadAttachmentsOptions): Promise<AttachmentItem[]> {
  const formData = new FormData();
  options.files.forEach((file) => {
    formData.append("files", file, file.name);
  });

  const folder = options.folder?.trim();
  if (folder) {
    formData.append("folder", folder);
  }

  if (options.name?.trim()) {
    formData.append("name", options.name.trim());
  }

  const response = await request<AttachmentUploadResponse>("/attachments", {
    method: "POST",
    body: formData,
  });

  if (Array.isArray(response)) {
    return response;
  }

  if (isAttachmentDataEnvelope(response)) {
    return response.data;
  }

  return [];
}

export async function deleteAttachment(id: number): Promise<void> {
  return request<void>(`/attachments/${id}`, {
    method: "DELETE",
  });
}

export interface UpdateAttachmentPayload {
  name?: string;
  folder?: string;
}

export async function updateAttachment(id: number, payload: UpdateAttachmentPayload): Promise<AttachmentItem> {
  return request<AttachmentItem>(`/attachments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export interface AttachmentLog {
  id: number;
  action: string;
  detail: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AttachmentDetail {
  attachment: AttachmentItem;
  logs: {
    data: AttachmentLog[];
    meta: {
      totalCount: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CreateRemarkPayload {
  attachmentId: number;
  title: string;
  message: string;
}

export async function createRemark(payload: CreateRemarkPayload): Promise<void> {
  return request<void>("/remarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export interface RemarkItemDto {
  id: number;
  title: string;
  message: string;
  attachmentId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRemarksDto {
  data: RemarkItemDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface FetchAttachmentRemarksOptions {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export async function fetchAttachmentRemarks(
  attachmentId: number,
  options: FetchAttachmentRemarksOptions = {}
): Promise<PaginatedRemarksDto> {
  const query = new URLSearchParams();
  const page = options.page && options.page > 0 ? options.page : undefined;
  if (page) {
    query.set("page", page.toString());
  }

  const limit =
    options.limit && options.limit > 0
      ? Math.min(options.limit, 100)
      : undefined;
  if (limit) {
    query.set("limit", limit.toString());
  }

  const queryString = query.toString();

  return request<PaginatedRemarksDto>(
    `/remarks/attachment/${attachmentId}${queryString ? `?${queryString}` : ""}`,
    {
      signal: options.signal,
    }
  ).then(normalizePaginatedRemarks);
}

export async function fetchAttachment(id: number, signal?: AbortSignal): Promise<AttachmentDetail> {
  return request<AttachmentDetail>(`/attachments/${id}`, {
    signal,
  });
}

export interface CreateAttachmentFolderOptions {
  folder: string;
}

export async function createAttachmentFolder(options: CreateAttachmentFolderOptions): Promise<AttachmentItem> {
  return request<AttachmentItem>("/attachments/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folder: options.folder.trim() }),
  });
}

export async function deleteDirectory(folder: string): Promise<void> {
  return request<void>(`/attachments/directory/${folder}`, {
    method: "DELETE",
  });
}
