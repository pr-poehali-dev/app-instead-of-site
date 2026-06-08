import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── DATA ────────────────────────────────────────────────────────────────────

const RACCOONS = [
  {
    id: "enotych",
    qrCode: "ENOTYCH_TUAPSE_2024",
    name: "Енотыч",
    role: "Дедушка-рыбак",
    emoji: "🎣",
    location: "Набережная Туапсе",
    coords: { x: 52, y: 61 },
    legend: "Старый мудрый Енотыч знает каждую рыбёшку в Туапсинской бухте. Говорят, он сидит с удочкой с самого рассвета и никогда не уходит без улова. Местные дети приносят ему бутерброды, а он взамен рассказывает морские байки.",
    installed: true,
    color: "#C8783A",
    image: "https://cdn.poehali.dev/projects/8f1084b0-91f0-46b1-873c-3fd6ee73d2e4/files/78287d90-4bc4-4ec9-be4e-5a5f8672a8d0.jpg",
  },
  {
    id: "enofya",
    qrCode: "ENOFYA_TUAPSE_2024",
    name: "Енофья",
    role: "Бабушка",
    emoji: "🧶",
    location: "Городской парк",
    coords: { x: 38, y: 45 },
    legend: "Добрая Енофья вяжет тёплые носки для всех жителей Туапсе. Её любимая скамейка в городском парке всегда окружена детьми и котами. Говорят, если попросить её с добрым словом, она загадает тебе желание.",
    installed: false,
    color: "#7B9EA8",
    image: "https://cdn.poehali.dev/projects/8f1084b0-91f0-46b1-873c-3fd6ee73d2e4/files/ef08cb43-8109-4743-a562-85167dbe4272.jpg",
  },
  {
    id: "tuapsey",
    qrCode: "TUAPSEY_TUAPSE_2024",
    name: "Туапсей",
    role: "Папа-моряк",
    emoji: "⚓",
    location: "Морской порт",
    coords: { x: 65, y: 72 },
    legend: "Капитан Туапсей бороздил моря от Сочи до Новороссийска. Теперь он гордо стоит у порта и встречает каждый корабль. На его груди — медаль за спасение кота Мурзика в шторм 1987 года.",
    installed: false,
    color: "#4A7FA5",
    image: null,
  },
  {
    id: "enotovna",
    qrCode: "ENOTOVNA_TUAPSE_2024",
    name: "Енотовна",
    role: "Мама-художница",
    emoji: "🎨",
    location: "Арт-квартал",
    coords: { x: 30, y: 58 },
    legend: "Талантливая Енотовна расписала все заборы Туапсе яркими морскими пейзажами. Её мастерская пахнет льняным маслом и морской солью. Говорят, она рисует только в золотой час заката.",
    installed: false,
    color: "#C4773A",
    image: null,
  },
  {
    id: "malchish",
    qrCode: "MALCHISH_TUAPSE_2024",
    name: "Малчиш",
    role: "Сын-серфер",
    emoji: "🏄",
    location: "Городской пляж",
    coords: { x: 72, y: 55 },
    legend: "Юный Малчиш — гроза городского пляжа. Каждое утро он первым врывается в волны и последним выходит из воды. Его мечта — объехать все пляжи Черноморья на своей доске.",
    installed: false,
    color: "#5BA8C4",
    image: null,
  },
  {
    id: "plyushka",
    qrCode: "PLYUSHKA_TUAPSE_2024",
    name: "Плюшка",
    role: "Дочка-кондитер",
    emoji: "🍩",
    location: "Центральный рынок",
    coords: { x: 44, y: 38 },
    legend: "Маленькая Плюшка каждое воскресенье печёт медовые пирожки для всей семьи. Её секрет — капля морской воды в тесте и много любви. Запах её выпечки разносится по всему рынку.",
    installed: false,
    color: "#D4973A",
    image: null,
  },
  {
    id: "kuzya",
    qrCode: "KUZYA_TUAPSE_2024",
    name: "Кузя",
    role: "Сын-непоседа",
    emoji: "⚽",
    location: "Стадион",
    coords: { x: 58, y: 30 },
    legend: "Непоседливый Кузя мечтает стать футболистом. Он гоняет мяч с утра до ночи и знает каждый закоулок туапсинских дворов. Говорят, однажды он забил гол прямо с набережной.",
    installed: false,
    color: "#6BAA6A",
    image: null,
  },
  {
    id: "zvezdochka",
    qrCode: "ZVEZDOCHKA_TUAPSE_2024",
    name: "Звёздочка",
    role: "Дочка-мечтатель",
    emoji: "⭐",
    location: "Смотровая площадка",
    coords: { x: 22, y: 28 },
    legend: "Маленькая Звёздочка каждую ночь считает звёзды над Туапсе. Она знает названия всех созвездий и верит, что однажды улетит к ним на воздушном шаре. Загадай желание, посмотрев ей в глаза!",
    installed: false,
    color: "#A07BC4",
    image: null,
  },
];

const PARTNERS = [
  { name: "Морской ресторан «Бухта»", logo: "🦀", discount: "10% скидка на обед", url: "#" },
  { name: "Отель «Туапсе»", logo: "🏨", discount: "Скидка на номер", url: "#" },
  { name: "Сувенирная лавка", logo: "🎁", discount: "Фирменный сувенир", url: "#" },
  { name: "Кафе «Ракушка»", logo: "🐚", discount: "Кофе в подарок", url: "#" },
];

type Tab = "map" | "scan" | "progress" | "partners";
type Raccoon = typeof RACCOONS[number];

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ found }: { found: number }) {
  return (
    <div className="relative overflow-hidden px-4 pt-8 pb-6 text-center">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(42,85%,60%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-body font-bold text-terracotta mb-3 border border-terracotta/20">
          🗺️ Городской квест · Туапсе
        </div>
        <h1 className="font-quest text-5xl font-bold text-foreground leading-none mb-1">Еноты</h1>
        <h2 className="font-quest text-3xl text-terracotta leading-none mb-3">Туапсе</h2>
        <p className="font-body text-sm text-muted-foreground">
          Найдено: <span className="font-bold text-terracotta">{found}</span> из {RACCOONS.length}
        </p>
      </div>
    </div>
  );
}

// ─── MAP ──────────────────────────────────────────────────────────────────────

function MapView({ found, onRaccoonClick }: { found: string[]; onRaccoonClick: (r: Raccoon) => void }) {
  const [filter, setFilter] = useState<"all" | "found" | "hidden">("all");

  const visible = RACCOONS.filter((r) => {
    if (filter === "found") return found.includes(r.id);
    if (filter === "hidden") return !found.includes(r.id);
    return true;
  });

  return (
    <div className="px-4 animate-fade-up">
      <div className="flex gap-2 mb-4">
        {(["all", "found", "hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold font-body transition-all ${
              filter === f ? "tab-active" : "bg-white/70 text-muted-foreground"
            }`}
          >
            {f === "all" ? "🗺 Все" : f === "found" ? "✅ Найдены" : "🔍 Ищем"}
          </button>
        ))}
      </div>

      <div
        className="relative rounded-3xl overflow-hidden border-2 border-terracotta/20 shadow-lg"
        style={{
          paddingBottom: "120%",
          background: "linear-gradient(160deg, hsl(42,55%,88%) 0%, hsl(185,30%,78%) 40%, hsl(200,40%,72%) 100%)",
        }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute bottom-0 right-0 w-2/5 h-2/5 rounded-tl-[60px]"
            style={{
              background: "linear-gradient(135deg, hsl(200,50%,68%) 0%, hsl(190,55%,58%) 100%)",
              opacity: 0.7,
            }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(25,35%,18%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-3 right-3 text-3xl opacity-50 select-none">🧭</div>
          <div className="absolute bottom-8 right-6 font-quest text-white/80 text-lg rotate-[-10deg] select-none">
            Чёрное море
          </div>

          {visible.map((raccoon) => {
            const isFnd = found.includes(raccoon.id);
            return (
              <button
                key={raccoon.id}
                onClick={() => onRaccoonClick(raccoon)}
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-110 active:scale-95"
                style={{ left: `${raccoon.coords.x}%`, top: `${raccoon.coords.y}%` }}
              >
                <div
                  className="map-dot shadow-lg"
                  style={{
                    background: isFnd
                      ? `linear-gradient(135deg, ${raccoon.color}, hsl(42,85%,60%))`
                      : "#B0A090",
                    opacity: isFnd ? 1 : 0.65,
                  }}
                >
                  <span className="map-dot-inner">{raccoon.emoji}</span>
                </div>
                <div
                  className="text-center mt-1"
                  style={{ transform: "translateX(-50%)", position: "absolute", left: "50%", width: "80px" }}
                >
                  <span
                    className="font-quest text-xs font-bold px-1.5 py-0.5 rounded-full text-white shadow"
                    style={{ background: isFnd ? raccoon.color : "#8A7A6A" }}
                  >
                    {raccoon.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3 font-body">
        Нажми на метку, чтобы узнать о еноте
      </p>
    </div>
  );
}

// ─── QR SCANNER ───────────────────────────────────────────────────────────────

function QRScanner({ onFound, found }: { onFound: (raccoon: Raccoon) => void; found: string[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startCamera = async () => {
    setError("");
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
    } catch {
      setCameraError(true);
      setError("Нет доступа к камере. Используй ручной ввод кода.");
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const checkCode = (code: string) => {
    const raccoon = RACCOONS.find((r) => r.qrCode === code.trim().toUpperCase());
    if (!raccoon) { setError("Неверный код. Попробуй ещё раз!"); return; }
    if (found.includes(raccoon.id)) { setError(`Ты уже нашёл ${raccoon.name}! 🎉`); return; }
    stopCamera();
    setError("");
    setManualCode("");
    onFound(raccoon);
  };

  return (
    <div className="px-4 animate-fade-up">
      <div className="card-quest p-5 mb-4">
        <h2 className="font-quest text-3xl text-foreground mb-1">Сканер QR</h2>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Найди табличку рядом с енотом и отсканируй QR-код
        </p>

        {!scanning && !cameraError && (
          <button onClick={startCamera} className="btn-teal w-full py-4 text-base font-body flex items-center justify-center gap-3">
            <Icon name="Camera" size={22} />
            Открыть камеру
          </button>
        )}

        {scanning && (
          <div className="relative rounded-2xl overflow-hidden bg-black mb-4" style={{ aspectRatio: "1" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="scan-line" />
            {(["tl", "tr", "bl", "br"] as const).map((c) => (
              <div
                key={c}
                className={`absolute w-8 h-8 ${
                  c === "tl" ? "top-3 left-3 border-t-2 border-l-2" :
                  c === "tr" ? "top-3 right-3 border-t-2 border-r-2" :
                  c === "bl" ? "bottom-3 left-3 border-b-2 border-l-2" :
                  "bottom-3 right-3 border-b-2 border-r-2"
                }`}
                style={{ borderColor: "hsl(185,40%,42%)" }}
              />
            ))}
            <button
              onClick={stopCamera}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}

        {cameraError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-700 font-body">
            📸 {error}
          </div>
        )}

        <div className="relative flex items-center my-4">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-xs text-muted-foreground font-body">или введи код вручную</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (manualCode.trim()) checkCode(manualCode); }} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Код с таблички..."
            className="flex-1 px-4 py-3 rounded-2xl border border-border bg-white/80 font-body text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          />
          <button type="submit" className="btn-primary px-5 py-3 font-body text-sm">
            ОК
          </button>
        </form>

        {error && !cameraError && (
          <p className="mt-3 text-sm text-destructive font-body text-center">{error}</p>
        )}
      </div>

      <div className="card-quest p-4">
        <p className="font-body text-xs text-muted-foreground mb-2 font-bold">🧪 Тестовые коды (демо):</p>
        <div className="flex flex-wrap gap-2">
          {RACCOONS.slice(0, 4).map((r) => (
            <button
              key={r.id}
              onClick={() => checkCode(r.qrCode)}
              className="text-xs bg-sand px-3 py-1.5 rounded-full font-body font-bold text-foreground"
            >
              {r.emoji} {r.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

function ProgressView({ found, onRaccoonClick }: { found: string[]; onRaccoonClick: (r: Raccoon) => void }) {
  const total = RACCOONS.length;
  const count = found.length;
  const pct = Math.round((count / total) * 100);
  const allFound = count === total;

  return (
    <div className="px-4 animate-fade-up">
      <div className="card-quest p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-quest text-3xl text-foreground">Мой прогресс</h2>
            <p className="font-body text-sm text-muted-foreground">
              {count === 0 ? "Начни квест — ищи первого енота!" :
               count < 4 ? "Хорошее начало! Продолжай!" :
               count < 7 ? "Половина семьи найдена! 🎉" :
               count < total ? "Почти все! Ещё чуть-чуть!" :
               "Ты собрал всю семью! 🏆"}
            </p>
          </div>
          <div className="text-right">
            <span className="font-quest text-5xl text-terracotta leading-none">{count}</span>
            <span className="font-quest text-2xl text-muted-foreground">/{total}</span>
          </div>
        </div>
        <div className="h-4 bg-sand rounded-full overflow-hidden mb-2">
          <div className="progress-bar h-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-right text-xs font-body text-muted-foreground">{pct}%</p>
      </div>

      {allFound && (
        <div
          className="card-quest p-6 mb-4 text-center animate-bounce-in"
          style={{ background: "linear-gradient(135deg, hsl(42,85%,95%) 0%, hsl(30,55%,92%) 100%)", border: "2px solid hsl(42,85%,60%)" }}
        >
          <div className="text-5xl mb-3">🏆</div>
          <h3
            className="font-quest text-3xl mb-1"
            style={{
              background: "linear-gradient(135deg, hsl(42,85%,45%), hsl(30,55%,38%), hsl(18,65%,45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Искатель Енотов!
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Ты нашёл всех 8 бронзовых енотов Туапсе. Ты настоящий герой города!
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Еноты Туапсе", text: "Я нашёл всех 8 бронзовых енотов Туапсе! 🦝🏆", url: window.location.href });
              }
            }}
            className="btn-primary px-6 py-3 font-body text-sm w-full flex items-center justify-center gap-2"
          >
            <Icon name="Share2" size={16} />
            Поделиться в соцсетях
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {RACCOONS.map((raccoon) => {
          const isFnd = found.includes(raccoon.id);
          return (
            <button
              key={raccoon.id}
              onClick={() => onRaccoonClick(raccoon)}
              className={`card-quest p-4 text-left transition-all active:scale-95 ${isFnd ? "" : "raccoon-hidden"}`}
            >
              <div className="text-3xl mb-2">{isFnd ? raccoon.emoji : "❓"}</div>
              <p className="font-body font-bold text-sm text-foreground">{isFnd ? raccoon.name : "???"}</p>
              <p className="font-body text-xs text-muted-foreground">{isFnd ? raccoon.role : "Не найден"}</p>
              {isFnd && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-terracotta">
                  <Icon name="CheckCircle2" size={12} />
                  Найден
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PARTNERS ─────────────────────────────────────────────────────────────────

function PartnersView() {
  return (
    <div className="px-4 animate-fade-up">
      <div className="mb-5">
        <h2 className="font-quest text-3xl text-foreground mb-1">Партнёры</h2>
        <p className="font-body text-sm text-muted-foreground">Компании, поддерживающие проект «Еноты Туапсе»</p>
      </div>

      <div className="space-y-3 mb-6">
        {PARTNERS.map((p, i) => (
          <div key={i} className="card-quest p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "hsl(42,55%,88%)" }}
            >
              {p.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-sm text-foreground">{p.name}</p>
              <p className="font-body text-xs font-bold mt-0.5" style={{ color: "hsl(185,40%,42%)" }}>{p.discount}</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-muted-foreground flex-shrink-0" />
          </div>
        ))}
      </div>

      <div
        className="card-quest p-5 text-center"
        style={{ background: "linear-gradient(135deg, hsl(185,40%,92%) 0%, hsl(42,55%,92%) 100%)" }}
      >
        <div className="text-4xl mb-3">🤝</div>
        <h3 className="font-quest text-2xl text-foreground mb-2">Стать партнёром</h3>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Присоединяйся к проекту — твой бренд увидят тысячи жителей и гостей Туапсе
        </p>
        <button className="btn-teal px-6 py-3 font-body text-sm w-full">Написать организаторам</button>
      </div>
    </div>
  );
}

// ─── RACCOON MODAL ────────────────────────────────────────────────────────────

function RaccoonModal({ raccoon, onClose }: { raccoon: Raccoon; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md animate-bounce-in rounded-t-3xl overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(42,60%,97%) 0%, hsl(35,50%,94%) 100%)" }}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />
        <div
          className="h-44 flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${raccoon.color}22, ${raccoon.color}44)` }}
        >
          {raccoon.image ? (
            <img src={raccoon.image} alt={raccoon.name} className="h-36 w-36 object-contain animate-float" />
          ) : (
            <div className="text-8xl animate-float">{raccoon.emoji}</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/70 rounded-full flex items-center justify-center"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-5 pb-8">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="font-quest text-4xl text-foreground leading-none">{raccoon.name}</h2>
              <p className="font-body text-sm font-bold mt-0.5" style={{ color: raccoon.color }}>{raccoon.role}</p>
            </div>
            <div className="flex items-center gap-1 bg-sand px-3 py-1.5 rounded-full text-xs font-body font-bold text-muted-foreground">
              <Icon name="MapPin" size={12} />
              {raccoon.location}
            </div>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-4 mb-5">{raccoon.legend}</p>
          {!raccoon.installed && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 text-xs font-body text-amber-700 flex items-center gap-2">
              <Icon name="Clock" size={14} />
              Фигура ещё устанавливается — следи за новостями!
            </div>
          )}
          <button onClick={onClose} className="btn-primary w-full py-4 font-body text-base">
            Понятно, иду искать!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FOUND NOTIFICATION ───────────────────────────────────────────────────────

function FoundNotification({ raccoon, onClose }: { raccoon: Raccoon; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm text-center animate-bounce-in">
        <div
          className="card-quest p-8"
          style={{
            background: "linear-gradient(135deg, hsl(42,85%,95%), hsl(18,65%,92%))",
            border: "2px solid hsl(42,85%,70%)",
          }}
        >
          <div className="text-6xl mb-4">{raccoon.emoji}</div>
          <div className="text-xs font-body font-bold text-terracotta uppercase tracking-widest mb-2">Находка!</div>
          <h2 className="font-quest text-5xl text-foreground mb-1">{raccoon.name}</h2>
          <p className="font-body text-sm text-muted-foreground mb-2">{raccoon.role}</p>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-body">
            <Icon name="MapPin" size={12} />
            {raccoon.location}
          </div>
          <div className="mt-5 flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl" style={{ color: "hsl(42,85%,60%)" }}>⭐</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<Tab>("map");
  const [found, setFound] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("enoты_tuapse_found") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedRaccoon, setSelectedRaccoon] = useState<Raccoon | null>(null);
  const [newlyFound, setNewlyFound] = useState<Raccoon | null>(null);

  useEffect(() => {
    localStorage.setItem("enoты_tuapse_found", JSON.stringify(found));
  }, [found]);

  const handleFound = (raccoon: Raccoon) => {
    setFound((prev) => (prev.includes(raccoon.id) ? prev : [...prev, raccoon.id]));
    setNewlyFound(raccoon);
    setTab("progress");
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "map", label: "Карта", icon: "Map" },
    { id: "scan", label: "Сканер", icon: "ScanLine" },
    { id: "progress", label: "Прогресс", icon: "Trophy" },
    { id: "partners", label: "Партнёры", icon: "Handshake" },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto font-body relative pb-28">
      <Header found={found.length} />

      <div className="mt-2">
        {tab === "map" && <MapView found={found} onRaccoonClick={setSelectedRaccoon} />}
        {tab === "scan" && <QRScanner onFound={handleFound} found={found} />}
        {tab === "progress" && <ProgressView found={found} onRaccoonClick={setSelectedRaccoon} />}
        {tab === "partners" && <PartnersView />}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-4 z-40">
        <div
          className="card-quest px-2 py-2 flex gap-1 shadow-xl"
          style={{ backdropFilter: "blur(20px)", background: "rgba(255,253,248,0.94)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all ${
                tab === t.id ? "tab-active" : "text-muted-foreground"
              }`}
            >
              <Icon name={t.icon} fallback="Circle" size={20} />
              <span className="text-[10px] font-bold leading-none">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selectedRaccoon && (
        <RaccoonModal raccoon={selectedRaccoon} onClose={() => setSelectedRaccoon(null)} />
      )}
      {newlyFound && (
        <FoundNotification raccoon={newlyFound} onClose={() => setNewlyFound(null)} />
      )}
    </div>
  );
}