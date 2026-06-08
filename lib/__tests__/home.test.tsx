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
  Target: () => <span>Target</span>,
  Zap: () => <span>Zap</span>,
  TrendingDown: () => <span>TrendingDown</span>,
  BarChart3: () => <span>BarChart3</span>,
}));

describe("Home landing page", () => {
  it("renders the headline", () => {
    render(<Home />);
    expect(screen.getByText(/Understand, track, and/)).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Home />);
    expect(screen.getByText(/CarbonKeeper is your personal carbon coach/)).toBeInTheDocument();
  });

  it("renders CTA button linking to dashboard", () => {
    render(<Home />);
    const cta = screen.getByText("Start Reducing Now →");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")).toHaveAttribute("href", "/dashboard");
  });

  it("renders all four pillars", () => {
    render(<Home />);
    expect(screen.getByText("Understand")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();
    expect(screen.getByText("Reduce")).toBeInTheDocument();
    expect(screen.getByText("Personalized Insights")).toBeInTheDocument();
  });

  it("renders bottom CTA section", () => {
    render(<Home />);
    expect(screen.getByText("Ready to reduce your footprint?")).toBeInTheDocument();
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
