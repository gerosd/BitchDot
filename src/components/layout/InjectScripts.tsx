import { JSDOM } from 'jsdom';

interface Props {
    html: string;
}

export default function InjectScripts({ html }: Props) {
    const dom = new JSDOM(`<div>${html}</div>`);
    const nodes = Array.from(dom.window.document.querySelector('div')!.childNodes);

    return (
        <>
            {nodes.map((node, i) => {
                if (node.nodeType !== 1) return null;
                const el = node as Element;
                const tag = el.tagName.toLowerCase();

                if (tag === 'script') {
                    return (
                        <script
                            key={i}
                            type={el.getAttribute('type') || undefined}
                            src={el.getAttribute('src') || undefined}
                            async={el.hasAttribute('async') || undefined}
                            dangerouslySetInnerHTML={
                                el.textContent ? { __html: el.textContent } : undefined
                            }
                        />
                    );
                }

                if (tag === 'noscript') {
                    return (
                        <noscript
                            key={i}
                            dangerouslySetInnerHTML={{ __html: el.innerHTML }}
                        />
                    );
                }

                return null;
            })}
        </>
    );
}