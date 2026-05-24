import Link from "next/link";
import { ArrowRight, Cat, Flame, Gem, Palette, Target, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTodaySession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";

export default async function HomePage() {
  const user = await prisma.user.findUnique({
    where: {
      id: DUMMY_USER_ID,
    },
  });

  const session = await getTodaySession(DUMMY_USER_ID);
  const streak = user?.streak ?? 0;
  const xp = user?.xp ?? 0;
  const hasCardsToday = session.remainingCount > 0;

  return (
      <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <header className="flex items-center justify-between gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Cat className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Vocat</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.name ? `Hallo, ${user.name}` : "Bereit für heute"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-10 items-center gap-1.5 rounded-full bg-orange-100 px-3 text-sm font-bold text-orange-700">
                <Flame className="size-4" />
                {streak}
              </div>
              <div className="flex h-10 items-center gap-1.5 rounded-full bg-sky-100 px-3 text-sm font-bold text-sky-700">
                <Gem className="size-4" />
                {xp}
              </div>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <Card className="overflow-hidden border-sky-100">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-700">
                  <Target className="size-4" />
                  Tagesquest
                </div>
                <h1 className="max-w-xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
                  Lerne deine Karten in kleinen, bunten Schritten.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Heute wartet eine kurze Session auf dich. Sammle XP, halte deinen
                  Streak und bring deine Wörter wieder nach vorne.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-sky-50 p-4">
                    <p className="text-xs font-bold uppercase text-sky-600">
                      Offen
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {session.remainingCount}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-emerald-50 p-4">
                    <p className="text-xs font-bold uppercase text-emerald-600">
                      Erledigt
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {session.reviewedTodayCount}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase text-amber-600">
                      Fortschritt
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {session.progress}%
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-8 h-14 w-full rounded-2xl bg-primary text-base font-black shadow-[0_5px_0_rgba(21,101,192,0.24)] hover:bg-primary/90 active:translate-y-1 active:shadow-none sm:w-auto sm:px-8"
                >
                  <Link href="/learn">
                    {hasCardsToday ? "Lernen starten" : "Session ansehen"}
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="border-cyan-100">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-muted-foreground">
                        Heute
                      </p>
                      <p className="text-2xl font-black text-slate-900">
                        {session.reviewedTodayCount} / {session.totalTodayCount}
                      </p>
                    </div>
                    <div className="flex size-14 items-center justify-center rounded-3xl bg-primary/15 text-primary">
                      <Trophy className="size-7" />
                    </div>
                  </div>
                  <Progress value={session.progress} />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {session.remainingCount === 0
                      ? "Alle Karten für heute sind erledigt."
                      : `${session.remainingCount} Karten bis zum Tagesziel.`}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 bg-emerald-50/90">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-3xl bg-white text-emerald-600 shadow-sm">
                      <Palette className="size-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700">
                        Nächstes Theme
                      </p>
                      <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                        Themes können später über XP freigeschaltet werden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
  );
}
