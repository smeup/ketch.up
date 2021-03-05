import { KupDom } from '../../types/GenericTypes';

/**
 * Debugging suite, used to log messages and statuses from the Ketch.UP components.
 * @module KupDebug
 */
export class KupDebug {
    /**
     * Function used to set the status of the debug.
     * If no argument is provided, this method will work as a toggler.
     *
     * @param {boolean} value - If this argument is provided, the debug status will be forced to its value.
     */
    toggle(value?: boolean): void {
        const dom: KupDom = document.documentElement as KupDom;
        if (typeof value !== 'boolean') {
            dom.kupDebug = !dom.kupDebug;
        } else {
            dom.kupDebug = value;
        }
    }
    /**
     * Function used to check whether the debug is active or not.
     * If kupDebug on documentElement's type is not a boolean, it will be set to false.
     *
     * @returns {boolean} Status of the debug.
     */
    isDebug(): boolean {
        const dom: HTMLElement = document.documentElement;
        if (typeof dom['kupDebug'] !== 'boolean') {
            dom['kupDebug'] = false;
        }
        return dom['kupDebug'];
    }
    /**
     * Displays a timestamped message in the browser's console when the kupDebug property on document.documentElement is true.
     * Warnings and errors will be displayed even when kupDebug !== true.
     *
     * @param {any} comp - The component calling this function or a string.
     * @param {string} message - The actual message that will be printed.
     * @param {string} type - The type of console message, defaults to "log" but "warning" and "error" can be used as well.
     */
    logMessage(comp: any, message: string, type?: string): void {
        if ((!type || type === 'log') && !this.isDebug()) {
            return;
        }
        let obj: object | string;
        let id: string = '';
        if (comp.rootElement) {
            id =
                ' ' +
                comp.rootElement.tagName +
                '#' +
                comp.rootElement.id +
                ' => ';
            obj = comp;
        } else {
            id = ' ' + comp + ' => ';
            obj = '';
        }
        var d = new Date(),
            minutes =
                d.getMinutes().toString().length == 1
                    ? '0' + d.getMinutes()
                    : d.getMinutes(),
            hours =
                d.getHours().toString().length == 1
                    ? '0' + d.getHours()
                    : d.getHours(),
            seconds =
                d.getSeconds().toString().length == 1
                    ? '0' + d.getSeconds()
                    : d.getSeconds(),
            milliseconds =
                d.getMilliseconds().toString().length == 1
                    ? '0' + d.getMilliseconds()
                    : d.getMilliseconds(),
            ampm = d.getHours() >= 12 ? 'pm' : 'am',
            months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let consoleDate =
            days[d.getDay()] +
            ' ' +
            months[d.getMonth()] +
            ' ' +
            d.getDate() +
            ' ' +
            d.getFullYear() +
            ' ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds +
            ',' +
            milliseconds +
            ampm;

        switch (type) {
            case 'error':
                console.error(consoleDate + id + message, obj);
                window.dispatchEvent(
                    new CustomEvent('kupError', {
                        bubbles: true,
                        detail: { comp, consoleDate, type, message },
                    })
                );
                break;
            case 'warning':
                console.warn(consoleDate + id + message, obj);
                window.dispatchEvent(
                    new CustomEvent('kupError', {
                        bubbles: true,
                        detail: { comp, consoleDate, type, message },
                    })
                );
                break;
            case 'log':
            default:
                console.log(consoleDate + id + message, obj);
                break;
        }
    }
    /**
     * Function used to time the loading times of a component.
     *
     * @param {any} comp - The component calling this function or a string.
     * @param {boolean} didLoad - Must be set to false when called inside a componentWillLoad() lifecycle hook and true when called inside componentDidLoad().
     */
    logLoad(comp: any, didLoad: boolean): void {
        if (!didLoad) {
            comp['debugInfo'] = {
                startTime: window.performance.now(),
                endTime: 0,
                renderCount: 0,
                renderStart: 0,
                renderEnd: 0,
            };
        } else {
            comp.debugInfo.endTime = window.performance.now();
            let timeDiff: number =
                comp.debugInfo.endTime - comp.debugInfo.startTime;
            if (this.isDebug()) {
                this.logMessage(
                    comp,
                    'Component ready after ' + timeDiff + 'ms.'
                );
            }
        }
    }
    /**
     * Function used to time the render times of a component.
     *
     * @param comp - The component calling this function or a string.
     * @param didRender - Must be set to false when called inside a componentWillRender() lifecycle hook and true when called inside componentDidRender().
     */
    logRender(comp: any, didRender: boolean): void {
        if (!didRender) {
            comp.debugInfo.renderCount++;
            comp.debugInfo.renderStart = window.performance.now();
        } else {
            comp.debugInfo.renderEnd = window.performance.now();
            let timeDiff: number =
                comp.debugInfo.renderEnd - comp.debugInfo.renderStart;
            if (this.isDebug()) {
                this.logMessage(
                    comp,
                    'Render #' +
                        comp.debugInfo.renderCount +
                        ' took ' +
                        timeDiff +
                        'ms.'
                );
            }
        }
    }
}