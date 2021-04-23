import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Waypoint } from 'react-waypoint';

import { BaseUrl } from '~/client/components/base-url';
import { OperationDetails } from '~/client/components/operation-details';
import { OperationExample } from '~/client/components/operation-example';
import { SectionStart } from '~/client/components/section-start';
import { Sidebar } from '~/client/components/sidebar';
import {
  getColor,
  getOperations,
  groupOperationsByGroupName,
} from '~/client/utils/schema';

import data from '../data.json';

let LAST_SCROLL = Date.now();

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    LAST_SCROLL = Date.now();
  });
}

function Home() {
  const router = useRouter();
  const operations = useMemo(() => getOperations(data), []);
  const grouped = groupOperationsByGroupName(operations);

  const page = Array.isArray(router.query.page)
    ? router.query.page.join('/')
    : router.query.page;

  const selectedOperation = page
    ? operations.find((op) => op.id === page)
    : operations[0];

  // scroll active page into view, should this only run on mount?
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // We don't want user scroll actions to trigger a scroll to anchor
    const invokedByScroll = Date.now() - LAST_SCROLL < 100;
    if (!invokedByScroll) {
      document.getElementById(page)?.scrollIntoView();
    }
  }, [page, router.isReady]);

  return (
    <>
      <Head>
        <title>
          {data.info.title} - {selectedOperation?.id}
        </title>
      </Head>
      <Sidebar operations={operations} />

      <main className="absolute right-0 left-72 top-0 px-12">
        <section>
          <div className="grid grid-cols-2 w-full gap-8">
            <SectionStart
              title={data.info.title}
              subtitle={`version: ${data.info.version}`}
              description={data.info.description}
            />

            <div className="space-y-4 sticky top-0 py-24 self-start">
              <BaseUrl
                url={`${data.schemes[0]}://${data.host}${data.basePath}`}
              />
            </div>
          </div>
        </section>

        {grouped.map(({ group, operations }) => (
          <div key={group.name}>
            <section className="grid grid-cols-2 w-full gap-8">
              <div className="grid grid-cols-2 w-full gap-8">
                <SectionStart
                  title={group.name}
                  description={group.description}
                />
              </div>
              <div className="space-y-4 sticky top-0 py-24 self-start">
                <div className="bg-gray-100 text-gray-400 rounded-lg overflow-hidden">
                  <div className="bg-gray-200 flex justify-between items-stretch px-4 py-2">
                    <div className="flex text-xs font-mono items-baseline font-medium space-x-4">
                      <div className="uppercase text-gray-500">endpoints</div>
                    </div>
                  </div>

                  <div className="bg-gray-100 text-gray-500 text-xs font-mono font-medium p-4">
                    {group.operations.map((operation) => (
                      <div key={operation.id} className="w-full flex space-x-2">
                        <div
                          className={`w-12 text-right uppercase text-${getColor(
                            operation,
                          )}-400`}
                        >
                          {operation.method}
                        </div>
                        <div>{operation.path}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {operations.map((operation) => (
              <Waypoint
                key={operation.id}
                topOffset="5%"
                bottomOffset="90%"
                fireOnRapidScroll={false}
                onEnter={() => {
                  router.replace(`/${operation.id}`, null, { shallow: true });
                }}
              >
                <section
                  id={operation.id}
                  key={operation.id}
                  className="grid grid-cols-2 w-full gap-8"
                >
                  <div className="py-24">
                    <OperationDetails
                      operation={operation}
                      definitions={data.definitions}
                    />
                  </div>

                  <div className="space-y-4 sticky top-0 py-24 self-start">
                    <OperationExample
                      operation={operation}
                      definitions={data.definitions}
                    />
                  </div>
                </section>
              </Waypoint>
            ))}
          </div>
        ))}
      </main>
    </>
  );
}

// TODO: move base url up to the top of the page, only needed once
export default Home;
