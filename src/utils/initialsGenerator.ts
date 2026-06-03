export const generateInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";
  let initials = words[0]!.charAt(0);
  if (words.length > 1) {
    initials += words[words.length - 1]!.charAt(0);
  }
  return initials.toUpperCase();
};
