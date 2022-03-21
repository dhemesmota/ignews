import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/client";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post excerpt</p>",
  updatedAt: "10 Março",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("renders correctly", () => {
    // Act
    render(<Post post={post} />);

    // Assert
    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    // Arrange
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);
    
    // Act
    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    // Assert
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it('loads initial data', async () => {
    // Arrange
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text: 'My new post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post content'}
          ],
        },
        last_publication_date: '04-01-2022'
      })
    } as any)

    // Act
    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    // Assert
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: '01 de abril de 2022'
          }
        }
      })
    );
  })
});
