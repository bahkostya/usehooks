import React from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import styled from "styled-components";
import Layout from "../components/Layout";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import analytics from "./../utils/analytics.js";

export const PostTemplate = ({ content, frontmatter, slug, permalink }) => {
  const extraLinks = frontmatter.links || [];

  return (
    <Hook id={frontmatter.title}>
      <Name>
        <i className="fas fa-link link-icon" />
        <Link to={slug}>{frontmatter.title}</Link>
      </Name>

      {frontmatter.composes && (
        <Composes>
          Composes:{` `}
          {frontmatter.composes.map((title, i) => (
            <>
              <Link to={`/${title}`}>{title}</Link>
              {i < frontmatter.composes.length - 1 ? "," : ""}
              {` `}
            </>
          ))}
        </Composes>
      )}

      <Content dangerouslySetInnerHTML={{ __html: content }} />

      <SyntaxHighlighter
        language="javascript"
        style={codeStyle}
        customStyle={{ borderRadius: "10px", padding: "1.5em" }}
      >
        {frontmatter.code}
      </SyntaxHighlighter>

      {(permalink === true || extraLinks.length > 0) && (
        <Links>
          <div className="links-title">📚 Also check out:</div>
          <ul>
            {extraLinks.map((link, i) => (
              <LinksLi key={i}>
                <a
                  target={link.target || "_blank"}
                  href={link.url}
                  onClick={() => {
                    analytics.track("clickExtraLink");
                  }}
                >
                  {link.name}
                </a>{" "}
                -{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: link.description
                  }}
                />
              </LinksLi>
            ))}
            {permalink === true && (
              <LinksLi key="divjoy">
                <a
                  href="https://divjoy.com?promo=usehooks"
                  onClick={() => {
                    analytics.track("clickExtraDivjoyLink");
                  }}
                >
                  Divjoy
                </a>{" "}
                -{" "}
                <span>
                  The easiest way to start your next React project. Pick
                  everything you need, like auth, analytics, payments, and more
                  + a nice looking template and then export a complete React
                  codebase. It saves you weeks of development time.
                </span>
              </LinksLi>
            )}
          </ul>
        </Links>
      )}

      <Info>
        <div className="level-item">{frontmatter.date}</div>
        <div className="level-item is-hidden-mobile">
          <span>•</span>
        </div>
        {frontmatter.sandbox && (
          <>
            <div className="level-item">
              <a target="_blank" href={frontmatter.sandbox}>
                Open in CodeSandbox
              </a>
            </div>
            <div className="level-item is-hidden-mobile">
              <span>•</span>
            </div>
          </>
        )}
        <div className="level-item">
          <a target="_blank" href={frontmatter.gist}>
            Suggest a change
          </a>
        </div>
      </Info>
    </Hook>
  );
};

const Post = ({ data, pageContext }) => {
  const { markdownRemark: post } = data;

  const { next } = pageContext;

  return (
    <Layout>
      <Helmet title={`${post.frontmatter.title} React Hook - useHooks`}>
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <PostTemplate
        content={post.html}
        frontmatter={post.frontmatter}
        slug={post.fields.slug}
        permalink={true}
      />

      <More>
        Next recipe:
        <Link to={next.fields.slug} rel="next" className="next">
          {next.frontmatter.title}
        </Link>
      </More>
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query PostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        composes
        gist
        sandbox
        links {
          url
          name
          description
        }
        code
      }
    }
  }
`;

const Hook = styled("div")`
  margin-bottom: 4rem;
`;

const Composes = styled("div").attrs({
  className: "subtitle"
})`
  padding-top: 3px;
  font-size: 0.9rem !important;
`;

const Name = styled("h2").attrs({
  className: "title is-3"
})`
  position: relative;

  .link-icon {
    display: none;
    position: absolute;
    left: -30px;
    top: 10px;
    opacity: 0.3;
    font-size: 22px;
  }

  a {
    color: inherit;
  }

  &:hover {
    .link-icon {
      display: inline;
    }
  }
`;

const Content = styled("div")`
  margin-bottom: 25px;
`;

const Links = styled("div")`
  background-color: #f3f9f8;
  padding: 25px;
  margin-top: 15px;
  border-radius: 10px;
  .links-title {
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

const LinksLi = styled("li")`
  margin-bottom: 5px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Info = styled("div").attrs({ className: "level" })`
  margin: 20px auto 0 auto;
  max-width: 560px;
  span {
    padding: 0 0.5rem;
    opacity: 0.2;
  }
`;

const More = styled("div")`
  text-align: center;
  font-size: 1.1rem;

  .next {
    margin-left: 10px;
    font-weight: bold;
  }

  i {
    opacity: 0.3;
    margin-right: 10px;
  }
`;
