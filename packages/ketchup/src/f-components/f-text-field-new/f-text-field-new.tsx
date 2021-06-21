import type { FTextFieldProps } from './f-text-field-declarations-new';
import { FunctionalComponent, getAssetPath, h } from '@stencil/core';

/*-------------------------------------------------*/
/*                C o m p o n e n t                */
/*-------------------------------------------------*/

export const FTextField: FunctionalComponent<FTextFieldProps> = (
    props: FTextFieldProps
) => {
    return (
        <div
            class={`f-text-field-new-wrapper ${
                props.fullHeight ? 'kup-full-height' : ''
            } ${props.fullWidth ? 'kup-full-width' : ''} ${
                props.shaped ? 'shaped' : ''
            } ${props.wrapperClass ? props.wrapperClass : ''}`}
            {...props.dataSet}
            id={props.id}
            title={props.title}
        >
            {props.leadingLabel || props.trailingLabel ? (
                <div
                    class={`form-field ${
                        props.leadingLabel ? 'form-field--align-end' : ''
                    }`}
                >
                    {[
                        setContent(props),
                        setHelper(props),
                        <label>{props.label}</label>,
                    ]}
                </div>
            ) : (
                [setContent(props), setHelper(props)]
            )}
        </div>
    );
};

/*-------------------------------------------------*/
/*                  M e t h o d s                  */
/*-------------------------------------------------*/

function setContent(props: FTextFieldProps): HTMLDivElement {
    const isOutlined: boolean = props.textArea || props.outlined;
    let labelEl: HTMLElement;
    let iconEl: HTMLElement;

    if (props.label && !props.leadingLabel && !props.trailingLabel) {
        labelEl = (
            <label class="floating-label" htmlFor="kup-input">
                {props.label}
            </label>
        );
    }

    if (props.icon) {
        let iconStyle: {
            [key: string]: string;
        };
        let iconClass: string = '';
        if (props.icon.indexOf('--kup') > -1) {
            iconClass = props.icon.replace('--kup-', '');
            iconClass = iconClass.replace('-icon', '');
        } else {
            let svg: string = `url('${getAssetPath(
                `./assets/svg/${props.icon}.svg`
            )}') no-repeat center`;
            iconStyle = {
                mask: svg,
                webkitMask: svg,
            };
        }
        iconEl = (
            <span
                tabindex="0"
                style={iconStyle}
                class={`text-field__icon icon-container action ${iconClass}`}
            ></span>
        );
    }

    const classObj: Record<string, boolean> = {
        'is-clearable': props.isClearable,
        'text-field': true,
        'text-field--disabled': props.disabled,
        'text-field--filled': !props.fullWidth && !isOutlined,
        'text-field--no-label': !props.label,
        'text-field--fullwidth': props.fullWidth,
        'text-field--outlined': isOutlined,
        'text-field--textarea': props.textArea,
        'text-field--with-leading-icon': props.icon && !props.trailingIcon,
        'text-field--with-trailing-icon': props.icon && props.trailingIcon,
    };

    return (
        <div class={classObj}>
            {props.textArea && props.maxLength ? (
                <div class="text-field-character-counter">
                    '0 / ' + {props.maxLength}
                </div>
            ) : undefined}
            {!props.trailingIcon ? iconEl : undefined}
            {props.textArea ? (
                <span class="text-field__resizer">
                    <textarea
                        class="text-field__input"
                        disabled={props.disabled}
                        readOnly={props.readOnly}
                        maxlength={props.maxLength}
                        value={props.value}
                    ></textarea>
                </span>
            ) : (
                <input
                    type={props.inputType ? props.inputType : 'text'}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    class="text-field__input"
                    disabled={props.disabled}
                    readOnly={props.readOnly}
                    placeholder={props.fullWidth ? props.label : undefined}
                    maxlength={props.maxLength}
                    value={props.value}
                ></input>
            )}
            {props.isClearable ? (
                <span
                    tabindex="1"
                    class="text-field__icon icon-container clear"
                ></span>
            ) : undefined}
            {props.trailingIcon ? iconEl : undefined}
            {!props.fullWidth && !isOutlined ? labelEl : undefined}
            {isOutlined ? (
                <div class="notched-outline">
                    <div class="notched-outline__leading"></div>
                    <div class="notched-outline__notch">{labelEl}</div>
                    <div class="notched-outline__trailing"></div>
                </div>
            ) : (
                <span class="line-ripple"></span>
            )}
        </div>
    );
}

function setHelper(props: FTextFieldProps): HTMLDivElement {
    if (props.helper) {
        const classObj: Record<string, boolean> = {
            'text-field-helper-text': true,
            'text-field-helper-text--persistent': !props.helperWhenFocused,
        };
        return (
            <div class="text-field-helper-line">
                <div class={classObj}>{props.helper}</div>
                {props.maxLength && !props.textArea ? (
                    <div class="text-field-character-counter">
                        '0 / ' + {props.maxLength.toString()}
                    </div>
                ) : undefined}
            </div>
        );
    } else {
        if (props.maxLength && !props.textArea) {
            return (
                <div class="text-field-helper-line">
                    <div class="text-field-character-counter">
                        '0 / ' + {props.maxLength}
                    </div>
                </div>
            );
        }
    }
}
