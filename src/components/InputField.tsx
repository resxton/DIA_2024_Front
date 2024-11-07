import { FC, KeyboardEvent } from 'react'
import { Button } from 'react-bootstrap'
import './InputField.css'

interface Props {
    value: string
    setValue: (value: string) => void
    onSubmit: () => void
    loading?: boolean
    placeholder?: string
    buttonTitle?: string
}

const InputField: FC<Props> = ({ value, setValue, onSubmit, loading, placeholder, buttonTitle = 'Искать' }) => {
    // Функция для обработки нажатия клавиш в поле ввода
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') { // Если нажата клавиша Enter
            onSubmit() // Запускаем функцию onSubmit
        }
    }

    return (
        <div className="inputField">
            <input
                value={value}
                placeholder={placeholder}
                onChange={(event) => setValue(event.target.value)}
                onKeyPress={handleKeyPress} // Добавляем обработчик нажатия клавиш
            />
            <Button disabled={loading} onClick={onSubmit}>
                {buttonTitle}
            </Button>
        </div>
    )
}

export default InputField
