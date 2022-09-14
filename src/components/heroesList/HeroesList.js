import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import { createSelector } from 'reselect';
import Spinner from '../spinner/Spinner';

import './HeroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
	const filteredHeroesSelector = createSelector(
		(state) => state.filters.activeFilter,
		(state) => state.heroes.heroes,
		(filter, heroes) => {
			if (filter === "all") {
				console.log("render");
				return heroes;
			} else {
				return heroes.filter(item => item.element === filter)
			}
		}
	)
	const filteredHeroes = useSelector(filteredHeroesSelector);
	const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
	const dispatch = useDispatch();


	// Функция берет id и по нему удаляет ненужного персонажа из store
	// ТОЛЬКО если запрос на удаление прошел успешно
	// Отслеживайте цепочку действий actions => reducers
	const onDelete = useCallback((id) => {
		// Удаление персонажа по его id
		dispatch(heroDeleted(id))
	}, [dispatch]);

	if (heroesLoadingStatus === "loading") {
		return <Spinner />;
	} else if (heroesLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
			return (
				<CSSTransition
					timeout={0}
					classNames="hero">
					<h5 className="text-center mt-5">Героев пока нет</h5>
				</CSSTransition>
			)
		}

		return arr.map(({ id, ...props }) => {
			return (
				<CSSTransition
					key={id}
					timeout={500}
					classNames="hero">
					<HeroesListItem  {...props} onDelete={() => onDelete(id)} />
				</CSSTransition>
			)
		})
	}

	const elements = renderHeroesList(filteredHeroes);
	return (
		<TransitionGroup component="ul">
			{elements}
		</TransitionGroup>
	)
}

export default HeroesList;