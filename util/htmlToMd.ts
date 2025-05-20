export type ToMdFunction = (tag: Tag, content: string) => string

export type Tag = {
    tag: string,
    toMd: ToMdFunction,
}

const tags: Tag[] = [
    {
        tag: 'h1',
        toMd: (tag, content) => `# ${content}\ņ`,
    },
    {
        tag: 'h2',
        toMd: (tag, content) => `## ${content}\n`,
    },
    {
        tag: 'h3',
        toMd: (tag, content) => `### ${content}\n`,
    },
    {
        tag: 'blockquote',
        toMd: (tag, content) => `> ${content.replace(/\n/g, '\n> ')}`,
    },
    {
        tag: 'i',
        toMd: (tag, content) => `*${content}*`,
    },
    {
        tag: 'b',
        toMd: (tag, content) => `**${content}**`,
    },
    {
        tag: 'strong',
        toMd: (tag, content) => `**${content}**`,
    },
    {
        tag: 'em',
        toMd: (tag, content) => `*${content}*`,
    },
    {
        tag: 'p',
        toMd: (tag, content) => `${content}\n\n`,
    },
    {
        tag: 'ul',
        toMd: (tag, content) => {
            const lines = content.split('\n')
            return lines.map(line => `- ${line}`).join('\n')
        },
    },
    {
        tag: 'ol',
        toMd: (tag, content) => {
            const lines = content.split('\n')
            return lines.map((line, index) => `${index + 1}. ${line}`).join('\n')
        },
    },
    {
        tag: 'li',
        toMd: (tag, content) => content,
    },
    {
        tag: 'br',
        toMd: (tag, content) => '\n',
    },
    {
        tag: 'a',
        toMd: (tag, content) => {
            const hrefMatch = content.match(/href="([^"]+)"/);
            const href = hrefMatch ? hrefMatch[1] : '';
            return `[${content.replace(/<.*?>/g, '')}](${href})`;
        },
    },
    {
        tag: 'img',
        toMd: (tag, content) => {
            const srcMatch = content.match(/src="([^"]+)"/);
            const altMatch = content.match(/alt="([^"]+)"/);
            const src = srcMatch ? srcMatch[1] : '';
            const alt = altMatch ? altMatch[1] : '';
            return `![${alt}](${src})`;
        },
    }
];

export const convertToMarkdown = (html: string): string => {
    let markdown = html;

    for (const tagObj of tags) {
        const regex = new RegExp(`<${tagObj.tag}>(.*?)</${tagObj.tag}>`, 'gi');
        markdown = markdown.replace(regex, (match, content) => {
            return tagObj.toMd(tagObj, content);
        });
    }

    markdown = markdown.replace(/<p><\/p>/g, '\n\n\\');

    markdown = markdown.replace(/<\/?[^>]+(>|$)/g, "");
    // remove extra newlines
    

    return markdown.trim();
}

export const convertToMarkdownWithTags = (html: string): string => {
    let markdown = html;

    // Process tags that wrap content
    for (const tagObj of tags) {
        const regex = new RegExp(`<${tagObj.tag}>(.*?)</${tagObj.tag}>`, 'gi');
        const tag = tagObj.tag;
        markdown = markdown.replace(regex, (match, content) => {
            return `<${tag}>${tagObj.toMd(tagObj, content)}</${tag}>`;
        }
        );
    }

    // Trim whitespace from the beginning and end of the string
    return markdown.trim();
}