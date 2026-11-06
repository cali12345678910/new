import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, X, Plus, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "المكتبة | Library — Al-Maqam" },
      { name: "description", content: "A curated digital Islamic library — classical texts and books." },
    ],
  }),
  component: LibraryPage,
});

type Book = { id: string; title: string; author: string; category: string; summary: string; content: string };

const BOOKS: Book[] = [
  { id: "nawawi40", title: "الأربعون النواوية", author: "الإمام النووي", category: "حديث", summary: "40 أحاديث نبوية جوامع الكلم", content: "الحديث الأول: إنما الأعمال بالنيات...\n\nالحديث الثاني: بني الإسلام على خمس..." },
  { id: "riyadh", title: "رياض الصالحين", author: "الإمام النووي", category: "أخلاق", summary: "مختارات من الأحاديث في الفضائل", content: "باب التوبة...\n\nباب الصبر..." },
  { id: "sadi", title: "تفسير السعدي", author: "الشيخ السعدي", category: "تفسير", summary: "تفسير ميسر لكتاب الله", content: "بسم الله الرحمن الرحيم...\n\nتفسير سورة الفاتحة..." },
  { id: "adhkar", title: "أذكار وآداب", author: "الإمام النووي", category: "ذكر", summary: "أذكار الصباح والمساء", content: "أذكار الصباح...\n\nأذكار المساء..." },
];

function LibraryPage() {
  const { lang } = useI18n();
  const [open, setOpen] = useState<Book | null>(null);
  const [size, setSize] = useState(18);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl gold-text">{lang === "ar" ? "المكتبة" : "Library"}</h1>
        <p className="text-sm text-muted-foreground">{lang === "ar" ? "مكتبة إسلامية رقمية مختارة" : "Curated digital Islamic library"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKS.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-xl leading-tight">{b.title}</h2>
              <Badge variant="secondary">{b.category}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{b.author}</p>
            <p className="text-sm">{b.summary}</p>
            <Button onClick={() => setOpen(b)} className="w-full">
              <BookOpen className="size-4 me-2" />
              {lang === "ar" ? "قراءة" : "Read"}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display gold-text">{open?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setSize((s) => Math.max(12, s - 2))}><Minus className="size-3" /></Button>
            <span className="text-xs">{size}px</span>
            <Button size="sm" variant="outline" onClick={() => setSize((s) => Math.min(32, s + 2))}><Plus className="size-3" /></Button>
            <Button size="sm" variant="ghost" className="ms-auto" onClick={() => setOpen(null)}><X className="size-4" /></Button>
          </div>
          <ScrollArea className="flex-1 rounded-xl bg-muted/40 p-4">
            <div style={{ fontSize: size, lineHeight: 1.9 }} className="whitespace-pre-wrap">{open?.content}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
