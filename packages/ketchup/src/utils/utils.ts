import get from 'lodash/get';

export function format(first: string, middle: string, last: string): string {
    return (
        (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '')
    );
}

export function generateUniqueId(field: string = 'def'): string {
    return new Date().getTime() + field.trim().replace(/\s/g, '_');
}

export function eventFromElement(element: HTMLElement, eventSource) {
    while (eventSource) {
        console.log(eventSource);
        if (eventSource === element) return true;
        eventSource = eventSource.parentElement;
    }
    return false;
}

/**
 * Given a camelCase formatted string, returns the same string in kebab-case.
 * @param str - the string to convert.
 * @return the converted string.
 */
export function toKebabCase (str: string): string {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
  
export function replacePlaceHolders(template: any, data: any) {
    template = typeof template === 'function' ? template() : template;
    if (['string', 'number'].indexOf(typeof template) === -1)
        throw 'please provide a valid template';

    if (!data) return template;

    template = template.replace(/\{\{([^}]+)\}\}/g, function(match) {
        match = match.slice(2, -2);
        var val = get(data, match, match);
        if (!val) return '{{' + match + '}}';
        return val;
    });

    return template;
}
