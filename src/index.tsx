import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const STORAGE_KEY = 'appliedArticleState';

const loadAppliedState = (): ArticleStateType => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return defaultArticleState;
		const parsed = JSON.parse(raw) as Partial<ArticleStateType>;
		return {
			...defaultArticleState,
			...parsed,
			fontFamilyOption:
				parsed.fontFamilyOption ?? defaultArticleState.fontFamilyOption,
			fontColor: parsed.fontColor ?? defaultArticleState.fontColor,
			backgroundColor:
				parsed.backgroundColor ?? defaultArticleState.backgroundColor,
			contentWidth: parsed.contentWidth ?? defaultArticleState.contentWidth,
			fontSizeOption:
				parsed.fontSizeOption ?? defaultArticleState.fontSizeOption,
		};
	} catch {
		return defaultArticleState;
	}
};

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// App хранит текущее состояние статьи
	const [articleState, setArticleState] = useState<ArticleStateType>(() =>
		loadAppliedState()
	);

	// Обёртка для css custom properties
	const cssVars = {
		'--font-family': articleState.fontFamilyOption.value,
		'--font-size': articleState.fontSizeOption.value,
		'--font-color': articleState.fontColor.value,
		'--container-width': articleState.contentWidth.value,
		'--bg-color': articleState.backgroundColor.value,
		minHeight: '100vh',
	} as CSSProperties;

	// добавляем data-атрибут для управления картинки
	const dataContent =
		articleState.contentWidth.value === '1394px' ? 'wide' : 'narrow';

	// Когда форма вызывает onStateChange, то применяется новое состояние и сохраняется
	const handleStateChange = (newState: ArticleStateType) => {
		setArticleState(newState);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
		} catch {}
	};

	return (
		<main
			className={clsx(styles.main)}
			style={cssVars}
			data-content={dataContent}>
			<ArticleParamsForm
				currentState={articleState}
				onStateChange={handleStateChange}
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
