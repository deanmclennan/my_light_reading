import Head from 'next/head'
import Link from 'next/link'
import linksData from '../public/links.json'

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

function getAllLinks(category) {
  let links = [...(category.links || [])]
  if (category.subcategories) {
    for (const sub of category.subcategories) {
      if (sub.subcategories) {
        for (const nested of sub.subcategories) {
          links = links.concat(nested.links || [])
        }
      } else {
        links = links.concat(sub.links || [])
      }
    }
  }
  return links
}

function getTotalLinkCount(category) {
  return getAllLinks(category).length
}

export default function Home({ mounted, isDark, toggleTheme }) {
  const categories = linksData.categories || []

  return (
    <>
      <Head>
        <title>My Light Reading - Curated Link Directory for Tech, Science, Finance & More</title>
        <meta name="description" content="A curated directory of the best websites and resources across tech, science, finance, health, gaming, aviation, and more. Find quality sources for your daily reading." />
        <meta name="keywords" content="link directory, curated links, tech news, science news, finance resources, developer tools, gaming news, aviation news, health resources" />
        <meta name="author" content="My Light Reading" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mylightreading.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mylightreading.com/" />
        <meta property="og:title" content="My Light Reading - Curated Link Directory" />
        <meta property="og:description" content="A curated directory of the best websites and resources across tech, science, finance, health, gaming, aviation, and more." />
        <meta property="og:site_name" content="My Light Reading" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mylightreading.com/" />
        <meta name="twitter:title" content="My Light Reading - Curated Link Directory" />
        <meta name="twitter:description" content="A curated directory of the best websites and resources across tech, science, finance, health, gaming, aviation, and more." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "My Light Reading",
              "description": "A curated directory of the best websites and resources across tech, science, finance, health, gaming, aviation, and more.",
              "url": "https://mylightreading.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mylightreading.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <header>
        <div className="header-row">
          <h1><span className="logo-text">My Light Reading</span></h1>
          {mounted && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
              {isDark ? (
                <><i className="fa-solid fa-sun"></i><span>Light</span></>
              ) : (
                <><i className="fa-solid fa-moon"></i><span>Dark</span></>
              )}
            </button>
          )}
        </div>
        <nav className="category-nav">
          {categories.map(cat => (
            <Link key={cat.name} href={`/category/${slugify(cat.name)}`} className="category-pill">
              {cat.name}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          ))}
        </nav>
      </header>

      <main>
        {categories.map(category => {
          const slug = slugify(category.name)
          const totalCount = getTotalLinkCount(category)
          const links = (category.links || []).slice(0, 6)

          return (
            <section key={slug} className="category">
              <h2 className="category-header">
                {category.name}
                <Link href={`/category/${slug}`}>View all {totalCount} sources →</Link>
              </h2>
              <div className="links">
                {links.map(link => (
                  <a key={link.url} href={link.url} className="link" target="_blank" rel="noopener noreferrer">
                    <img src={getFaviconUrl(link.url)} alt="" className="link-icon" loading="lazy" />
                    <span className="link-title">{link.title}</span>
                    <span className="link-url">{getDomain(link.url)}</span>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
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
