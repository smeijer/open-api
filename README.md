# Choices Made

## Sorting / Grouping

Swagger groups endpoints by tag, but tags are optional. I've added a fallback for "groupnames" by taking the first path of the url. So `/pet/findByStatus` belongs to group `pet`, unless it's properly tagged. In a product app, a more advanced solution might be required.

## Media Types

I don't render the supported media types (`application/json` / `application/xml`) as that doesn't offer much value for this POC. I assume that we're handling JSON only.

## Dynamic colors

I'm using template literals to build colors. Note that this is supported, because I'm using Twind (`bg-${color}-600`). When using `tailwindcss`, this would not be possible due to css purging.

## Prop drilling

I've pushed the `definitions` as prop all the way down from root to the final consumer. In a production app, it might be cleaner to either reshape the `data` to a more complete model, or to use context. Anyways, this works, and it isn't that bad either. It's more the mix between reshaping and prop drilling that I'm not a fan of.

## Response Model

I haven't visualized the response model, as I already visualize the `example value`. Rendering the model felt like more of the same.

## Server API

The server response is based on the provided payload. When a request body is present, some data will be substituted with fake values, before it's being returned. If no request body is present, we'll send a `{ ok: true }` response.

Server response is intentionally slowed down, to provide a more calm interface for this POC / while working local. In a production version, we might want to use something like `spin-delay`.
