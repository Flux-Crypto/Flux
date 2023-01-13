interface QuantityCellProps {
    value: string;
    currency: string;
}

const QuantityCell = ({ value, currency }: QuantityCellProps) => (
    <div>
        {value}
        {currency}
    </div>
);

export default QuantityCell;
