import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("lucide-react", () => ({
  Leaf: () => <span>Leaf</span>,
  Target: () => <span>Target</span>,
  RefreshCw: () => <span>RefreshCw</span>,
  Zap: () => <span>Zap</span>,
}));

describe("Home landing page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(screen.getByText(/Track your life/)).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Home />);
    expect(screen.getByText(/A playful, lightning-fast tracker/)).toBeInTheDocument();
  });

  it("renders CTA button linking to dashboard", () => {
    render(<Home />);
    const cta = screen.getByText("Start Tracking Now →");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("renders all three feature steps", () => {
    render(<Home />);
    expect(screen.getByText("1. Tell us what you did")).toBeInTheDocument();
    expect(screen.getByText("2. AI Calculates the impact")).toBeInTheDocument();
    expect(screen.getByText("3. Discover effortless swaps")).toBeInTheDocument();
  });

  it("renders bottom CTA section", () => {
    render(<Home />);
    expect(screen.getByText("Ready to take action?")).toBeInTheDocument();
  });

  it("renders bottom dashboard link", () => {
    render(<Home />);
    const link = screen.getByText("Go to Dashboard");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("renders footer", () => {
    render(<Home />);
    expect(screen.getByText(/Built for individuals, not corporations/)).toBeInTheDocument();
  });
});
