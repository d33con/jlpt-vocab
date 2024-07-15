import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 1000) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    showScrollButton && (
      <div className="fixed bottom-20 right-20" onClick={scrollToTop}>
        <button className="btn btn-secondary">Top</button>
      </div>
    )
  );
};

export default ScrollToTopButton;
