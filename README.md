![alt text](public/logo-text.svg 'open-api logo')

# Live Version:

https://open-api.meijer.ws/

# Choices Made

## Sorting / Grouping

Swagger groups endpoints by tag, but tags are optional. I've added a fallback for "groupnames" by taking the first part of the url path. So `/pet/findByStatus` belongs to group `pet`, unless it's properly tagged. In a production app, a more advanced solution might be required.

## Media Types

I don't render the supported media types (`application/json` / `application/xml`) as that doesn't offer much value for this POC. I assume that we're handling `JSON` only.

## Dynamic colors

I'm using template literals to construct colors (`bg-${color}-600`). Note that this is supported, because I'm using Twind. When using `tailwindcss`, this would not be possible due to css purging.

## Prop drilling

I've pushed the `definitions` as prop all the way down from root to the final consumer. In a production app, it might be cleaner to either reshape the `data` to a more complete model, or to use context. Anyways, this works, and it isn't that bad either. It's more the mix between reshaping and prop drilling that I'm not a fan of.

## Response Model

I haven't visualized the response model, as I already visualize the `example value`. Rendering the model felt like more of the same.

## Server API

The server response is based on the provided payload. When a request body is present, some data will be substituted with fake values, after which it's being returned. If no request body is present, we'll send a `{ ok: true }` response.

In a production version, we might want to use something like `spin-delay` to have a better spinner experience.

## Tests

Although we did mention it briefly on Discord, I haven't implemented tests, as I was running out of time. If I were to implement tests, I would add:

- a test covering the API handler, to ensure the expected result is returned upon queries. This test would be implemented like my tests at [@rakered/nextjs-auth-api/src/auth.test.ts](https://github.com/rakered/rakered/blob/main/packages/nextjs-auth-api/src/auth.test.ts)

- a test covering the search input, that will type something and asserts that the menu items are filtered.

- a test covering the "response simulator", that will push the "play icon" and asserts that a results is being rendered.

- a few assertions to select important elements, like headings, using `testing-library`. This way we ensure that certain elements are present, and accessible.

More advanced tests would assert that the url updates while scrolling, and that the correct item is selected in the sidebar. But then again, this kind of tests are tricky to write and take some time. While that functionality is nice, it's not crucial.
