import { db } from "@/db";
import { claps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Image from "next/image";

async function getClapCount() {
  try {
    const { count } = (await db.query.claps.findFirst({
      where: eq(claps?.id, 0),
    })) ?? { count: 0 };
    return count;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function incrementClaps() {
  "use server";
  const current = await getClapCount();
  if (current !== undefined) {
    await db
      .insert(claps)
      .values({ id: 0, count: current + 1 })
      .onConflictDoUpdate({
        target: claps.id,
        set: { count: current + 1 },
      });
    revalidatePath("/");
  }
}

export default async function Home() {
  const clapCount = await getClapCount();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8">
        <img
          className="mx-auto"
          alt="Prezel logo"
          width={80}
          height={80}
          src="https://prezel.app/icon.svg"
        />
        {/* <span>Prezel</span> */}
        {/* <p>This is an example based on Next.js + Drizzle</p> */}
        <div className="rounded-lg border bg-gray-50 p-4 text-gray-600 dark:border-white/20 dark:bg-gray-900 dark:text-gray-400">
          <p>
            Every deployment in prezel comes with a Sqlite DB setup out of the
            box.
          </p>
          <p>
            All you have to do to use it is pointing to{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              PREZEL_DB_URL
            </code>
          </p>
        </div>
        <p>Want to see Prezel DB in action? Just clap it up below!</p>
        <div className="flex items-center gap-4">
          <form action={incrementClaps}>
            <button
              type="submit"
              className="h-10 rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              <img
                className="dark:invert"
                width={20}
                height={20}
                alt="clap image"
                src="https://www.svgrepo.com/show/9764/clap.svg"
              />
            </button>
          </form>
          {clapCount !== undefined && <span>{clapCount} claps so far!</span>}
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://docs.prezel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/ricopinazo/prezel/tree/main/examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://prezel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to prezel.app →
        </a>
      </footer>
    </div>
  );
}
