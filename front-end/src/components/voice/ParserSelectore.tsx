import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useRedux';
import { setSelectedParser } from '../../store/parserSlice';
import type { ParserId } from '../../types/parser';

const ParserSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { options, selectedId } = useSelector(
    (state: RootState) => state.parser
  );

  const handleSelect = (id: ParserId) => {
    dispatch(setSelectedParser(id));
  };

  return (
    <div className="parser-selector">
      <span className="parser-selector-label">Select parser:</span>
      <div className="parser-selector-options">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={
              'parser-chip' + (opt.id === selectedId ? ' parser-chip--active' : '')
            }
            onClick={() => handleSelect(opt.id)}
          >
            <div className="parser-chip-title">{opt.label}</div>
            <div className="parser-chip-desc">{opt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParserSelector;