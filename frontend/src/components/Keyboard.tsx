import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface KeyboardProps {
  pressedKey: string | null;
  className?: string;
}

const KEYBOARD_LAYOUT = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
  ["Ctrl", "Meta", "Alt", " ", "Alt", "Ctrl"],
];

const KEY_WIDTHS: Record<string, string> = {
  Backspace: "w-[120px]",
  Tab: "w-[90px]",
  "\\": "w-[70px]",
  CapsLock: "w-[110px]",
  Enter: "w-[120px]",
  Shift: "w-[140px]",
  Ctrl: "w-[90px]",
  Meta: "w-[70px]",
  Alt: "w-[70px]",
  " ": "w-[300px]",
};

export function Keyboard({ pressedKey, className }: KeyboardProps) {
  const [currentActiveKey, setCurrentActiveKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (pressedKey) {
      // Normalize the key to match keyboard layout
      const normalizedKey = normalizeKey(pressedKey);
      setCurrentActiveKey(normalizedKey);
    } else {
      // Clear when no key is pressed
      setCurrentActiveKey(null);
    }
  }, [pressedKey]);

  const normalizeKey = (key: string): string => {
    // Map special keys to their display names
    const keyMap: Record<string, string> = {
      " ": " ",
      Enter: "Enter",
      Backspace: "Backspace",
      Tab: "Tab",
      Shift: "Shift",
      Control: "Ctrl",
      Meta: "Meta",
      Alt: "Alt",
      CapsLock: "CapsLock",
      Escape: "Esc",
      ArrowUp: "↑",
      ArrowDown: "↓",
      ArrowLeft: "←",
      ArrowRight: "→",
    };

    if (keyMap[key]) return keyMap[key];
    
    // Convert to lowercase for letter matching
    return key.toLowerCase();
  };

  const getKeyDisplay = (key: string): string => {
    if (key === " ") return "Space";
    if (key === "Meta") return "⌘";
    if (key === "Ctrl") return "Ctrl";
    if (key === "Alt") return "Alt";
    if (key === "Shift") return "Shift";
    if (key === "CapsLock") return "Caps";
    if (key === "Tab") return "Tab";
    if (key === "Enter") return "Enter";
    if (key === "Backspace") return "⌫";
    return key.toUpperCase();
  };

  const isKeyActive = (key: string): boolean => {
    if (!currentActiveKey) return false;
    const normalized = normalizeKey(key);
    return currentActiveKey === normalized || currentActiveKey === key.toLowerCase();
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground">Keyboard Visualization</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="h-8"
        >
          {isVisible ? "Hide Keyboard" : "Show Keyboard"}
        </Button>
      </div>
      {isVisible && (
        <div className="bg-muted/50 rounded-lg p-4 border">
          <div className="flex flex-col gap-2">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {row.map((key) => {
                  const isActive = isKeyActive(key);
                  const width = KEY_WIDTHS[key] || "w-[50px]";
                  
                  return (
                    <div
                      key={key}
                      className={cn(
                        "h-12 flex items-center justify-center rounded-md",
                        "text-sm font-medium transition-all duration-150",
                        "border border-border",
                        width,
                        isActive
                          ? "bg-primary text-primary-foreground scale-105 shadow-lg border-primary"
                          : "bg-background text-foreground hover:bg-muted"
                      )}
                    >
                      {getKeyDisplay(key)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

