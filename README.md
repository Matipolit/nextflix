This is a netflix-like application for watching self-hosted media created in Next.js

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Database format

The database is stored inside a .json file, the location of which is specified in the config file

The database is formatted like this:

```json
{
	"movies" : [
		{
			"name" : "Alien",
			"year" : 1979,
			"director" : "Ridley Scott",
			"poster link" : "https://abc.com",
			"file location" : "/home/matipolit/movies/alien.1979/alien.1979.mp4"
		}
	],

	"shows" : [
		{
			"name" : "Stranger Things",
			"yearStart" : 2016,
			"yearEnd" : 0,
			"director" : "The Duffer Brothers",
			"poster link" : "https://abc.com",
			"seasons" : [
				{
					"name" : "Season 1",
					"year" : 2016,
					"episodes" : [
						{
							"title" : "Episode 1",
							"file location" : "/home/matipolit/series/stranger.things/season.1/episode.1.mp4"
						}
					]
				}
			]
		}
	]
}
```

