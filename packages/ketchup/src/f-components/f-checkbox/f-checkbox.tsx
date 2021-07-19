import type { FCheckboxProps } from './f-checkbox-declarations';
import { FunctionalComponent, h } from '@stencil/core';

/*-------------------------------------------------*/
/*                C o m p o n e n t                */
/*-------------------------------------------------*/

export const FCheckbox: FunctionalComponent<FCheckboxProps> = (
    props: FCheckboxProps
) => {
    const indeterminateAttr = {
        'data-indeterminate': props.indeterminate ? true : false,
    };

    const classObj: Record<string, boolean> = {
        checkbox: true,
        'checkbox--checked':
            props.checked && !props.indeterminate ? true : false,
        'checkbox--disabled': props.disabled ? true : false,
        'checkbox--indeterminate': props.indeterminate ? true : false,
    };

    return (
        <div
            class={`f-checkbox--wrapper ${
                props.wrapperClass ? props.wrapperClass : ''
            }`}
            {...props.dataSet}
            id={props.id}
            title={props.title}
        >
            <div
                class={`form-field ${
                    props.leadingLabel ? 'form-field--align-end' : ''
                }`}
            >
                <div class={classObj}>
                    <input
                        type="checkbox"
                        class="checkbox__native-control"
                        checked={props.checked}
                        disabled={props.disabled}
                        {...indeterminateAttr}
                        value={props.checked ? 'on' : 'off'}
                    />
                    <div class="checkbox__background">
                        <svg class="checkbox__checkmark" viewBox="0 0 24 24">
                            <path
                                class="checkbox__checkmark-path"
                                fill="none"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59"
                            />
                        </svg>
                        <div class="checkbox__mixedmark"></div>
                    </div>
                </div>
                {props.label ? <label>{props.label}</label> : undefined}
            </div>
        </div>
    );
};
