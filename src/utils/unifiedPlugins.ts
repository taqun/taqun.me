/* eslint-disable @typescript-eslint/no-explicit-any */
import { Literal } from 'mdast';
import { normalizeUri } from 'micromark-util-sanitize-uri';
import { Plugin } from 'unified';
import { is } from 'unist-util-is';
import { select } from 'unist-util-select';
import { visit, SKIP } from 'unist-util-visit';

const DESCRIPTION_LENGTH = 120;

export const remarkDescription: Plugin = () => {
  return (tree: any, file: any) => {
    const firstChild = select('root > *:first-child', tree);
    if (is(firstChild, 'paragraph')) {
      const text = select('text', firstChild);
      if (text) {
        let description = (text as Literal).value;
        if (description.length > DESCRIPTION_LENGTH) {
          description = `${description.slice(0, DESCRIPTION_LENGTH - 1)}…`;
        }

        file.data.description = description;
      }
    }
  };
};

export const remarkImageCaption: Plugin = () => {
  return (tree: any) => {
    visit(tree, isImageWithCaption, (node, index, parent) => {
      if (index != null) {
        parent.children[index] = { ...node, type: 'image-with-caption' };
        return SKIP;
      }
    });
  };
};

const isImageWithCaption = (node: any) => {
  if (node.type != 'paragraph') {
    return false;
  }

  if (node.children[0] == null || node.children[0].type != 'image') {
    return false;
  }

  if (node.children[0].title == null) {
    return false;
  }

  return true;
};

export const imageCaptionHandler = (h: any, node: any): any => {
  const imageNode = node.children[0];

  const properties = {
    src: normalizeUri(imageNode.url),
    alt: imageNode.alt,
    title: imageNode.title,
  };

  return {
    type: 'element',
    tagName: 'figure',
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties,
      },
      {
        type: 'element',
        tagName: 'figurecaption',
        children: [
          {
            type: 'text',
            value: imageNode.title || imageNode.alt,
          },
        ],
      },
    ],
  };
};
