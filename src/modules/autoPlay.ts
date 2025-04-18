import { playSoundEffect } from "./sound";
import { triggerSpinAction, setIsAutoPlay, setAutoplayCount } from "./slot";

export function initAutoplayControls(): void {
  const autoplayModal = document.getElementById("autoplayModal");
  const autoplayButtons =
    document.querySelectorAll<HTMLButtonElement>(".autoplayBtn");
  const startAutoplayBtn =
    document.querySelector<HTMLButtonElement>("#startAutoplayBtn");

  let selectedAutoplayValue = 0;

  if (!startAutoplayBtn || autoplayButtons.length === 0) {
    return;
  }

  autoplayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.contains("active");
      playSoundEffect("btn_click");

      autoplayButtons.forEach((btn) => btn.classList.remove("active"));

      if (!isActive) {
        button.classList.add("active");
        startAutoplayBtn.classList.remove("autplay-btn-disabled");
        startAutoplayBtn.disabled = false;

        selectedAutoplayValue = parseInt(button.textContent ?? "0");
        setAutoplayCount(selectedAutoplayValue);
      } else {
        startAutoplayBtn.classList.add("autplay-btn-disabled");
        startAutoplayBtn.disabled = true;
        selectedAutoplayValue = 0;
        setAutoplayCount(selectedAutoplayValue);
      }
    });
  });

  startAutoplayBtn.addEventListener("pointerdown", () => {
    if (selectedAutoplayValue === 0) {
      console.log("Autoplay nije izabran");
      return;
    }

    if (autoplayModal) {
      autoplayModal.style.display = "none";
    }

    autoplayButtons.forEach((btn) => btn.classList.remove("active"));

    startAutoplayBtn.classList.add("autplay-btn-disabled");
    startAutoplayBtn.disabled = true;

    playSoundEffect("btn_click");
    setIsAutoPlay(true);
    triggerSpinAction();
  });

  if (autoplayModal) {
    autoplayModal.addEventListener("click", handleCloseAutoplayModal);
    autoplayModal.addEventListener("touchend", handleCloseAutoplayModal);
  }

  function handleCloseAutoplayModal(event: MouseEvent | TouchEvent) {
    const target = event.target as HTMLElement;

    if (target.classList.contains("close-autoplay-modal")) {
      setAutoplayCount(0);

      playSoundEffect("btn_click");
      if (autoplayModal) {
        autoplayModal.style.display = "none";
      }
      autoplayButtons.forEach((btn) => btn.classList.remove("active"));

      if (startAutoplayBtn) {
        startAutoplayBtn.classList.add("autplay-btn-disabled");
        startAutoplayBtn.disabled = true;
      }
    }
  }
}
