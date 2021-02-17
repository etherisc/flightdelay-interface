import React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input<{ active?: boolean; align?: string }>`
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text2)};
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg2};
  font-size: ${({ active }) => (active ? '20px' : '16px')};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px 8px;
  min-height: 2.2rem;
  border-radius: 12px;
  -webkit-appearance: textfield;
  :hover {
    background-color: ${({ theme }) => theme.bg3};
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text2};
  }
`

export const Input = React.memo(function InnerInput({
  value,
  active,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  active?: boolean
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  return (
    <StyledInput
      {...rest}
      value={value}
      active={active}
      onChange={event => {
        onUserInput(event.target.value)
      }}
      onBlur={event => onUserInput(event.target.value)}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={6}
      spellCheck="false"
    />
  )
})

export default Input

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
