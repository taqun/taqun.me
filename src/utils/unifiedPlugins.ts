/* eslint-disable @typescript-eslint/no-explicit-any */
import { Literal } from 'mdast';
import { Plugin } from 'unified';
import { is } from 'unist-util-is';
import { select } from 'unist-util-select';

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
