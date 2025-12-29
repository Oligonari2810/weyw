"use client";

type Props = {
  onPay?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
};

export default function PaymentButtons({ onPay, onCancel, disabled }: Props) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button type="button" onClick={() => onPay?.()} disabled={disabled}>
        Pagar
      </button>
      <button type="button" onClick={() => onCancel?.()} disabled={disabled}>
        Cancelar
      </button>
    </div>
  );
}

