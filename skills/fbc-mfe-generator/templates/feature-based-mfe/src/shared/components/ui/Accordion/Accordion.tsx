import React, {
  useState,
  FC,
  ReactNode,
} from "react";
import ChevronDown from "@shared/assets/images/chevron-down.svg";

interface AccordionProps {
  header: ReactNode;   // Componente visible siempre
  content: ReactNode;  // Componente oculto (el cuerpo)
  className?: string;
}

const Accordion: FC<AccordionProps> = ({ header, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mf-border-black mf-border mf-rounded-md">
      <div
        className="mf-flex mf-cursor-pointer mf-items-center mf-justify-between mf-p-4"
        onClick={toggle}
      >
        <div className="mf-flex mf-flex-row mf-justify-between mf-flex-1 ">
            {header}
        </div>
        <img
          src={ChevronDown}
          alt="chevron-down"
          className={`mf-transform mf-transition-transform mf-duration-300 mf-ml-2 ${
            isOpen ? "mf-rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`mf-overflow-hidden mf-transition-all mf-ease-in-out ${
          isOpen ? "mf-max-h-screen" : "mf-max-h-0"
        }`}
      >
        <div className="mf-p-4">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
