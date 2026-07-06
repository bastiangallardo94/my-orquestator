import { render, screen } from "@testing-library/react";
import React from "react";
import { InspectionDetailItem } from "./InspectionDetailItem";

// Mock capitalizeWords to ensure it's called and returns predictable output
jest.mock("@shared/utils/capitalizeWords", () => ({
  capitalizeWords: (str: string) => `Capitalized(${str})`,
}));

describe("InspectionDetailItem", () => {
  const baseProps = {
    title: "Test Title",
    description: "TEST DESCRIPTION",
    imageSrc: "/test-image.png",
  };

  it("renders title and description with capitalizeWords applied", () => {
    render(<InspectionDetailItem {...baseProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Capitalized(TEST DESCRIPTION)")).toBeInTheDocument();
  });

  it("renders image with provided src and default alt text", () => {
    render(<InspectionDetailItem {...baseProps} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/test-image.png");
    expect(img).toHaveAttribute("alt", "Card image"); // default alt
  });

  it("renders image with custom alt text when provided", () => {
    render(<InspectionDetailItem {...baseProps} imageAlt="Custom Alt" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Custom Alt");
  });

  it("applies correct CSS classes to container and elements", () => {
    const { container } = render(<InspectionDetailItem {...baseProps} />);
    // Root div should have flex row classes
    expect(container.firstChild).toHaveClass("mf-flex", "mf-flex-row", "mf-items-center", "mf-pb-4");
    // Bold description paragraph
    expect(screen.getByText("Capitalized(TEST DESCRIPTION)")).toHaveClass("mf-font-bold");
  });
});
