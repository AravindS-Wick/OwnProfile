import type { Profile } from "@/lib/types";

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--navy)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          © {year}{" "}
          <span className="text-gradient font-semibold">{profile.name}</span>.
          Built with Next.js, Three.js & too much ambition.
        </p>

        <div className="flex items-center gap-4">
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors text-sm"
            >
              GitHub
            </a>
          )}
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors text-sm"
            >
              LinkedIn
            </a>
          )}
          {profile.socials.twitter && (
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors text-sm"
            >
              Twitter
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          All systems operational
        </div>
      </div>
    </footer>
  );
}
