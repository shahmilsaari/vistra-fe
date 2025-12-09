export const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatAction = (action: string) => {
  switch (action) {
    case "attachment.upload": return "Added file";
    case "attachment.delete": return "Deleted file";
    case "attachment.rename": return "Renamed file";
    case "attachment.move": return "Moved file";
    case "attachment.download": return "Downloaded file";
    default: return action.replace("attachment.", "").replace("_", " ");
  }
};
