import MarkdownIT from 'markdown-it';

const md = new MarkdownIT();

export function SectionStart({ title, subtitle = null, description }) {
  return (
    <div className="py-24 space-y-4">
      <div>
        <h2 className="text-2xl">{title}</h2>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>

      <div
        className="font-light pb-4"
        dangerouslySetInnerHTML={{
          __html: md.render(description),
        }}
      />
    </div>
  );
}
