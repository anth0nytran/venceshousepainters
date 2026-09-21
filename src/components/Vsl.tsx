import { useState } from "react";
import { Play } from "lucide-react";
import { VSL_POSTER, VSL_SRC } from "@/lib/site";

/**
 * The big picture under the headline. It's the team shot today; once
 * VSL_SRC is set it becomes the video's poster with a play button, and
 * the video loads only when someone presses play.
 */
export default function Vsl({ className = "" }: { className?: string }) {
    const [playing, setPlaying] = useState(false);

    return (
        <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-ink ${className}`}>
            {VSL_SRC && playing ? (
                <video className="h-full w-full object-cover" src={VSL_SRC} poster={VSL_POSTER} controls autoPlay playsInline />
            ) : (
                <>
                    <img
                        src={VSL_POSTER}
                        srcSet="/img/team-800.webp 800w, /img/team.webp 1600w"
                        sizes="(min-width: 720px) 680px, 100vw"
                        alt="The Vences House Painters crew in their blue shirts inside a home they are painting"
                        className="h-full w-full object-cover"
                        width={1600}
                        height={900}
                        fetchPriority="high"
                    />
                    {VSL_SRC && (
                        <button
                            type="button"
                            onClick={() => setPlaying(true)}
                            aria-label="Play video"
                            className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/85 text-white transition-transform hover:scale-105"
                        >
                            <Play className="ml-1 h-9 w-9 fill-current" aria-hidden="true" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
