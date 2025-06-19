import { createStyles } from 'antd-style'

export const useStyles = createStyles(({ css }) => ({
  background: css`
    position: relative;
    width: 100vw;
    min-height: 100vh;
    background: #fff url('/img-fundo.jpg') no-repeat center center/cover;
    overflow: hidden;
  `,
  topBar: css`
    width: 100%;
    height: 40px;
    background: #07b4ba;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 40px;
    color: #fff;
    font-size: 16px;
  `,
  logoutButton: css`
    position: absolute;
    top: 30px;
    right: 60px;
    width: 64px;
    height: 99px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 2;
  `,
  logoutText: css`
    font-size: 29px;
    color: #506175;
    font-style: italic;
    font-weight: 500;
  `,
  perfilBox: css`
    position: absolute;
    top: 127px;
    left: 50%;
    transform: translateX(-50%);
    width: 492px;
    height: 115px;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 34px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 3;
  `,
  perfilImg: css`
    width: 105px;
    height: 105px;
    border-radius: 50%;
    object-fit: cover;
  `,
  perfilLabel: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,
  saudar: css`
    font-size: 42px !important;
    font-style: italic;
    color: #506175 !important;
    margin: 0 !important;
    line-height: 1.1;
  `,
  clinica: css`
    font-size: 42px !important;
    font-style: italic;
    color: #506175 !important;
    margin: 0 !important;
    line-height: 1.1;
  `,
  mainOptions: css`
    position: absolute;
    top: 495px;
    left: 50%;
    transform: translateX(-50%);
    width: 950px;
    display: flex;
    gap: 50px;
    z-index: 4;
  `,
  optionCard: css`
    width: 150px !important;
    height: 139px !important;
    background: #ecf3f1 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  `,
  optionIcon: css`
    font-size: 64px;
    margin-bottom: 8px;
    color: #07b4ba;
  `,
  optionText: css`
    font-family: 'Catamaran', sans-serif;
    font-size: 22px;
    color: #07b4ba;
    text-align: center;
    width: 100%;
  `
}))
