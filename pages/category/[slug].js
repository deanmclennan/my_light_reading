import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import linksData from '../../public/links.json'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return ''
  }
}

function getFaviconUrl(url) {
  const domain = getDomain(url)
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`
}

function getTotalLinkCount(category) {
  let count = (category.links || []).length
  if (category.subcategories) {
    for (const sub of category.subcategories) {
      if (sub.subcategories) {
        for (const nested of sub.subcategories) {
          count += (nested.links || []).length
        }
      } else {
        count += (sub.links || []).length
      }
    }
  }
  return count
}

function LinkItem({ link }) {
  return (
    <a href={link.url} className="link" target="_blank" rel="noopener noreferrer">
      <img src={getFaviconUrl(link.url)} alt="" className="link-icon" loading="lazy" />
      <span className="link-title">{link.title}</span>
      <span className="link-url">{getDomain(link.url)}</span>
    </a>
  )
}

function NestedSubcategory({ sub, searchQuery }) {
  const [activeNested, setActiveNested] = useState('all')

  const filterLinks = (links) => {
    if (!searchQuery) return links
    return links.filter(link =>
      link.title.toLowerCase().includes(searchQuery) ||
      link.url.toLowerCase().includes(searchQuery)
    )
  }

  return (
    <div className="subcategory">
      <h3 className="subcategory-header">{sub.name}</h3>
      <div className="subcat-nav">
        <span
          className={`subcat-pill ${activeNested === 'all' ? 'active' : ''}`}
          onClick={() => setActiveNested('all')}
        >
          All
        </span>
        {sub.subcategories.map(nested => (
          <span
            key={nested.name}
            className={`subcat-pill ${activeNested === slugify(nested.name) ? 'active' : ''}`}
            onClick={() => setActiveNested(slugify(nested.name))}
          >
            {nested.name}
          </span>
        ))}
      </div>

      {activeNested === 'all' ? (
        sub.subcategories.map(nested => {
          const nestedLinks = filterLinks(nested.links || [])
          if (nestedLinks.length === 0 && searchQuery) return null
          return (
            <div key={nested.name} className="nested-section">
              <h4 className="nested-header">{nested.name}</h4>
              <div className="links">
                {nestedLinks.map(link => (
                  <LinkItem key={link.url} link={link} />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div className="links">
          {sub.subcategories
            .find(n => slugify(n.name) === activeNested)
            ?.links.filter(link =>
              !searchQuery ||
              link.title.toLowerCase().includes(searchQuery) ||
              link.url.toLowerCase().includes(searchQuery)
            )
            .map(link => (
              <LinkItem key={link.url} link={link} />
            ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryPage({ category, allCategories, isDark, toggleTheme }) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!category) {
    return (
      <div className="no-results">
        Category not found. <Link href="/">Go back</Link>
      </div>
    )
  }

  const linkCount = getTotalLinkCount(category)
  const query = searchQuery.toLowerCase().trim()

  const filterLinks = (links) => {
    if (!query) return links
    return links.filter(link =>
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    )
  }

  const mainLinks = filterLinks(category.links || [])

  return (
    <>
      <Head>
        <title>{category.name} - Curated Links & Resources | My Light Reading</title>
        <meta name="description" content={`Browse ${linkCount} curated ${category.name.toLowerCase()} links and resources on My Light Reading.`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="My Light Reading" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <header>
        <Link href="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to all categories
        </Link>
        <div className="header-row">
          <h1><span className="logo-text">My Light Reading</span></h1>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? (
              <><i className="fa-solid fa-sun"></i><span>Light</span></>
            ) : (
              <><i className="fa-solid fa-moon"></i><span>Dark</span></>
            )}
          </button>
        </div>
        <nav className="category-nav">
          {allCategories.map(cat => (
            <Link
              key={cat.name}
              href={`/category/${slugify(cat.name)}`}
              className={`category-pill ${slugify(cat.name) === slugify(category.name) ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <h2 className="category-title">{category.name}</h2>
        <p className="category-count">{linkCount} links</p>
        <input
          type="text"
          className="search-box"
          placeholder="Search in this category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />

        <div>
          {mainLinks.length > 0 && (
            <div className="links">
              {mainLinks.map(link => (
                <LinkItem key={link.url} link={link} />
              ))}
            </div>
          )}

          {category.subcategories?.map(sub => {
            if (sub.subcategories && sub.subcategories.length > 0) {
              return <NestedSubcategory key={sub.name} sub={sub} searchQuery={query} />
            } else {
              const subLinks = filterLinks(sub.links || [])
              if (subLinks.length === 0 && query) return null
              return (
                <div key={sub.name} className="subcategory">
                  <h3 className="subcategory-header">{sub.name}</h3>
                  <div className="links">
                    {subLinks.map(link => (
                      <LinkItem key={link.url} link={link} />
                    ))}
                  </div>
                </div>
              )
            }
          })}
        </div>
      </main>

      <footer>
        <p><strong>My Light Reading</strong> — A curated directory of quality links across tech, science, finance, and more.</p>
        <p>Hand-picked resources to help you stay informed without the noise.</p>
        <p>Like this project? Follow me:</p>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/dean-mclennan-3aa5a2153/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i> LinkedIn
          </a>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  const categories = linksData.categories || []
  const paths = categories.map(cat => ({
    params: { slug: slugify(cat.name) }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const categories = linksData.categories || []
  const category = categories.find(c => slugify(c.name) === params.slug) || null

  return {
    props: {
      category,
      allCategories: categories
    }
  }
}
