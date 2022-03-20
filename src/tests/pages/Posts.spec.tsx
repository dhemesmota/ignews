import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";


const posts = [
  {
    slug: "my-new-post",
    title: "My new post",
    excerpt: "Post excerpt",
    updatedAt: "10 Março",
  },
];

jest.mock('../../services/prismic')

describe("Posts page", () => {
  it("renders correctly", () => {
    // Act
    render(<Posts posts={posts} />);

    // Assert
    expect(screen.getByText("My new post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    // Arrange
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                {type: 'heading', text: 'My new post'}
              ],
              content: [
                {type: 'paragraph', text: 'Post excerpt'}
              ],
            },
            last_publication_date: '04-01-2022'
          }
        ]
      })
    } as any)

    // Act
    const response = await getStaticProps({});

    // Assert
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2022'
          }],
        },
      })
    );
  });
});
