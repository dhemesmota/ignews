import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, {getStaticProps} from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("../../services/stripe");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});

describe("Home page", () => {
  it("renders correctly", () => {
    // Act
    render(
      <Home
        product={{
          priceId: "fake-price-id",
          amount: "$10,00",
        }}
      />
    );

    // Assert
    expect(screen.getByText("for $10,00 month")).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    // Arrange
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    // Act
    const response = await getStaticProps({})

    // Assert
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
});
