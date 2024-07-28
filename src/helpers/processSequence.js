/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    __,
    allPass,
    andThen,
    compose,
    length,
    lt,
    gt,
    test,
    toString,
    ifElse,
    prop,
    tap,
    otherwise,
    pipe,
    mathMod
} from 'ramda';

const api = new Api();

// Валидация
const isLengthValid = compose(allPass([lt(__, 10), gt(__, 2)]), length);
const isPositive = compose(gt(__, 0), parseFloat);
const isValidNumber = allPass([test(/^[0-9.]+$/), isLengthValid, isPositive]);

// Конвертация строки в число и округление
const toNumber = compose(Math.round, parseFloat);

// Перевод числа из 10-й системы счисления в двоичную
const convertToBinary = (number) =>
    api.get('https://api.tech/numbers/base', { from: 10, to: 2, number });

// Получить животное по ID
const getAnimal = (id) => api.get(`https://animals.tech/${id}`);

// Логирование и обработка ошибок
const logAndReturn = (writeLog) => tap(writeLog);
const handleValidationError = (handleError) => () => handleError('ValidationError');
const handleApiError = (handleError) => otherwise(handleError);

// Основной процесс
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const onValidationSuccess = compose(
        handleApiError(handleError),
        andThen(pipe(
            prop('result'),
            toString,
            logAndReturn(writeLog),
            length,
            logAndReturn(writeLog),
            (len) => Math.pow(len, 2),
            logAndReturn(writeLog),
            mathMod(__, 3),
            logAndReturn(writeLog),
            getAnimal,
            handleApiError(handleError),
            andThen(prop('result')),
            andThen(handleSuccess)
        )),
        convertToBinary,
        logAndReturn(writeLog),
        toNumber
    );

    const processValue = ifElse(
        isValidNumber,
        onValidationSuccess,
        handleValidationError(handleError)
    );

    pipe(
        logAndReturn(writeLog),
        processValue
    )(value);
};

export default processSequence;
