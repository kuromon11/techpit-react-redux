import React, { useState } from 'react';
import styled from 'styled-components';

import { Header as _Header } from './Header';
import { Column } from './Column';
import { DeleteDialog } from './DeleteDialog';
import { Overlay as _Overlay } from './Overlay';

export function App() {
  const [filterValue, setFilterValue] = useState('');
  const [columns, setColumns] = useState([
    {
      id: 'A',
      title: 'TODO',
      cards: [
        { id: 'a', text: '朝食をとる🍞' },
        { id: 'b', text: 'SNSをチェックする🐦' },
        { id: 'c', text: '布団に入る (:3[___]' },
      ],
    },
    {
      id: 'B',
      title: 'Doing',
      cards: [
        { id: 'd', text: '顔を洗う👐' },
        { id: 'e', text: '歯を磨く🦷' },
      ],
    },
    {
      id: 'C',
      title: 'Waiting',
      cards: [],
    },
    {
      id: 'D',
      title: 'Done',
      cards: [{ id: 'f', text: '布団から出る (:3っ)っ -=三[＿＿]' }],
    },
  ]);

  const [draggingCardID, setDraggingCardID] = useState<string | undefined>(undefined);

  const dropCardTo = (toID: string) => {
    const fromID = draggingCardID;
    if (!fromID) return;

    setDraggingCardID(undefined);

    if (fromID === toID) return;

    setColumns((columns) => {
      const card = columns.flatMap((col) => col.cards).find((c) => c.id === fromID);
      if (!card) {
        return columns;
      }

      return columns.map((column) => {
        const hasNewColumn = column.cards.some((c) => c.id === fromID);
        const newColumn = hasNewColumn
          ? {
              ...column,
              cards: column.cards.filter((c) => c.id !== fromID),
            }
          : column;
        // 列の末尾に移動
        if (newColumn.id === toID) {
          return { ...newColumn, cards: [...newColumn.cards, card] };
        }
        // 列の末尾以外に移動
        else if (newColumn.cards.some((c) => c.id === toID)) {
          return {
            ...newColumn,
            cards: newColumn.cards.flatMap((c) => (c.id === toID ? [card, c] : [c])),
          };
        }

        return newColumn;
      });
    });
  };

  return (
    <Container>
      <Header filterValue={filterValue} onFilterChange={setFilterValue} />
      <MainArea>
        <HorizontalScroll>
          {columns.map(({ id: columnID, title, cards }) => (
            <Column
              key={columnID}
              title={title}
              filterValue={filterValue}
              cards={cards}
              onCardDragStart={(cardID) => setDraggingCardID(cardID)}
              onCardDrop={(entered) => dropCardTo(entered ?? columnID)}
            />
          ))}
        </HorizontalScroll>
      </MainArea>
      <Overlay>
        <DeleteDialog />
      </Overlay>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const Header = styled(_Header)`
  flex-shrink: 0;
`;

const MainArea = styled.div`
  height: 100%;
  padding: 16px 0;
  overflow-y: auto;
`;

const HorizontalScroll = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    margin-left: 16px;
    flex-shrink: 0;
  }

  ::after {
    display: block;
    flex: 0 0 16px;
    content: '';
  }
`;

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
