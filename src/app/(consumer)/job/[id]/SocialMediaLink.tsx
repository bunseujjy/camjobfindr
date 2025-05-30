import { JSX } from "react";

interface SocialMediaLinkProps {
  url: string | undefined;
  icon: JSX.Element;
  label: string;
}

export const SocialMediaLink = ({ url, icon, label }: SocialMediaLinkProps) => {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary"
      aria-label={label}
    >
      {icon}
    </a>
  );
};
