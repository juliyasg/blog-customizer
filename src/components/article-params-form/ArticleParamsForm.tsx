import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onStateChange: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentState,
	onStateChange,
}: ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

	// временное состояние формы
	const [formState, setFormState] = useState<ArticleStateType>(currentState);

	const formRootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isFormOpen) return; // сайдбар закрыт, ничего не вешаем

		const handlePointerDown = (e: MouseEvent | TouchEvent) => {
			const target = e.target as Node | null;
			if (!formRootRef.current || !target) return;

			// клик вне панели, закрываем
			if (!formRootRef.current.contains(target)) {
				setIsFormOpen(false);
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);

		// удаляем обработчики при закрытии
		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
		};
	}, [isFormOpen]);

	useEffect(() => {
		setFormState(currentState);
	}, [currentState]);

	const toggleFormOpen = () => setIsFormOpen((v) => !v);

	const handleApply = (e?: React.FormEvent) => {
		e?.preventDefault?.();
		onStateChange(formState);
		setIsFormOpen(false);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onStateChange(defaultArticleState);
		setIsFormOpen(false);
	};

	const handleChangeFontFamily = (opt: OptionType) =>
		setFormState((s) => ({ ...s, fontFamilyOption: opt }));

	const handleChangeFontSize = (opt: OptionType) =>
		setFormState((s) => ({ ...s, fontSizeOption: opt }));

	const handleChangeFontColor = (opt: OptionType) =>
		setFormState((s) => ({ ...s, fontColor: opt }));

	const handleChangeBackgroundColor = (opt: OptionType) =>
		setFormState((s) => ({ ...s, backgroundColor: opt }));

	const handleChangeContentWidth = (opt: OptionType) =>
		setFormState((s) => ({ ...s, contentWidth: opt }));

	useEffect(() => {
		if (!isFormOpen) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsFormOpen(false);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isFormOpen]);

	return (
		<>
			<ArrowButton isOpen={isFormOpen} onClick={toggleFormOpen} />

			<aside
				ref={formRootRef}
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}
				aria-hidden={!isFormOpen}>
				<form className={styles.form} onSubmit={handleApply}>
					<div className={styles.formTitle}>
						<Text as='h2' size={31} weight={800}>
							ЗАДАЙТЕ ПАРАМЕТРЫ
						</Text>
					</div>

					<div className={styles.formField}>
						<Select
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={handleChangeFontFamily}
							placeholder='Выберите шрифт'
							title='ШРИФТ'
						/>
					</div>

					<div className={styles.formField}>
						<RadioGroup
							name='font-size'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={handleChangeFontSize}
							title='РАЗМЕР ШРИФТА'
						/>
					</div>

					<div className={styles.formField}>
						<Select
							selected={formState.fontColor}
							options={fontColors}
							onChange={handleChangeFontColor}
							placeholder='Выберите цвет'
							title='ЦВЕТ ШРИФТА'
						/>
					</div>

					<div className={styles.separatorContainer}>
						<Separator />
					</div>

					<div className={styles.formField}>
						<Select
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={handleChangeBackgroundColor}
							placeholder='Выберите цвет'
							title='ЦВЕТ ФОНА'
						/>
					</div>

					<div className={styles.formField}>
						<Select
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={handleChangeContentWidth}
							placeholder='Выберите ширину'
							title='ШИРИНА КОНТЕНТА'
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
