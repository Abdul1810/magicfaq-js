document.addEventListener("DOMContentLoaded", function () {
	(function () {
		if (window.MagicFAQ) return;
		window.MagicFAQ = true;

		const scriptTag = document.querySelector('script[src*="magicfaq-js"]');
		if (!scriptTag) return;

		const uid = scriptTag.getAttribute("data-uid") || "default_uid";
		const position = scriptTag.getAttribute("data-position") || "bottom-right";

		const button = document.createElement("div");
		button.id = "magic-faq-button";
		button.style.position = "fixed";
		button.style.width = "64px";
		button.style.height = "64px";
		button.style.backgroundColor = "#007bff";
		button.style.color = "white";
		button.style.borderRadius = "50%";
		button.style.display = "flex";
		button.style.alignItems = "center";
		button.style.justifyContent = "center";
		button.style.cursor = "pointer";
		button.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
		button.style.transition = "all 0.3s ease";
		button.style.opacity = "0";
		button.style.transform = "scale(0.8)";
		button.style.zIndex = "9999";

		if (position.includes("top")) {
			button.style.top = "24px";
		} else {
			button.style.bottom = "24px";
		}
		if (position.includes("left")) {
			button.style.left = "24px";
		} else {
			button.style.right = "24px";
		}

		document.body.appendChild(button);

		const iframe = document.createElement("iframe");
		iframe.src = `https://magicfaq.vercel.app/?mid=${uid}`;
		iframe.title = "Magic FAQ Widget";
		iframe.style.position = "fixed";
		iframe.style.bottom = "0px";
		iframe.style.right = "0px";
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		iframe.style.border = "none";
		iframe.style.zIndex = "1000";
		iframe.style.display = "none";
		document.body.appendChild(iframe);

		setTimeout(() => {
			button.style.opacity = "1";
			button.style.transform = "scale(1)";
		}, 100);

		const chatIcon =
			`<svg fill="#fff" width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<title>Chat</title>
				<path d="M96 368Q83 368 74 359 64 349 64 336L64 128Q64 114 74 105 83 96 96 96L416 96Q430 96 439 105 448 114 448 128L448 336Q448 349 439 359 430 368 416 368L256 368 160 464 160 368 96 368Z" />
			</svg>`;
		const closeIcon =
			`<svg fill="#fff" width="24px" height="24px" viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.5 15.313a1.026 1.026 0 0 1-.728-.302l-6.8-6.8a1.03 1.03 0 0 1 1.455-1.456L8.5 12.828l6.073-6.073a1.03 1.03 0 0 1 1.455 1.456l-6.8 6.8a1.026 1.026 0 0 1-.728.302z" />
			</svg>`;

		button.innerHTML = chatIcon;

		let isWidgetOpen = false;

		const updateWidgetState = () => {
			iframe.style.display = isWidgetOpen ? "block" : "none";
			button.style.backgroundColor = "#007bff";
			button.innerHTML = isWidgetOpen ? closeIcon : chatIcon;

			if (iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ action: isWidgetOpen ? "open" : "close" },
					"*"
				);
			}
		};

		button.addEventListener("click", () => {
			isWidgetOpen = !isWidgetOpen;
			updateWidgetState();
		});

		window.addEventListener("message", (event) => {
			if (event.data.action === "close") {
				isWidgetOpen = false;
				updateWidgetState();
			}
		});

		button.addEventListener("mouseenter", () => {
			button.style.transform = "scale(1.05)";
		});
		button.addEventListener("mouseleave", () => {
			button.style.transform = isWidgetOpen ? "scale(0.9)" : "scale(1)";
		});

		const handleKeyDown = (event) => {
			if (event.key === "Escape" && isWidgetOpen) {
				isWidgetOpen = false;
				updateWidgetState();
				window.parent.postMessage({ action: "close" }, "*");
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		window.addEventListener("beforeunload", () => {
			document.removeEventListener("keydown", handleKeyDown);
		});
	})();
});

// Usage example:
{/* <script src="https://cdn.magicfaq.co/script.js" data-uid="12345" data-position="bottom-right"></script> */ }