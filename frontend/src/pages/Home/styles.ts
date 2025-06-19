import { createStyles } from 'antd-style'

export const useStyles = createStyles(({ css }) => ({
  bodyHome: css`
    position: relative;
    width: 100vw;
    min-height: 100vh;
    background: #fff url('/img-fundo.jpg') no-repeat center center/cover;
    overflow: hidden;
  `,
  divAgendar: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 52px;
    gap: 51px;
    width: 457px;
    height: 247px;
    background: #c5ebfe;
    border-radius: 27.1456px;
  `,
  bodyAgendar: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 51px;
    width: 308px;
    height: 31px;
  `,
  textAgendar: css`
    width: 308px;
    height: 31px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 25.853px;
    line-height: 31px;
    color: #000;
  `,
  btnAgendar: css`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 200px;
    height: 85px;
    background: #76bfac;
    border: 5px solid #cfe3e1;
    border-radius: 25px;
  `,
  textBtnAgendar: css`
    width: 121px;
    height: 36px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 36px;
    color: #fff;
  `,
  imgDoctor: css`
    width: 105px;
    height: 105px;
    border-radius: 50%;
    object-fit: cover;
  `,
  doctorImg: css`
    width: 674.59px;
    height: 463px;
    background-size: cover;
    background-position: center;
  `,
  textEspecialidades: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 0;
    gap: 10px;
    width: 529px;
    height: 44px;
  `,
  textEspecialidadesTitle: css`
    width: 529px;
    height: 44px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 44px;
    text-align: center;
    color: #000;
  `,
  especialidades: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 0;
    gap: 61.63px;
    width: 1174px;
    min-width: 357.86px;
    height: 585px;
  `,
  cardEspecialidade: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 9.62px;
    isolation: isolate;
    width: 346.38px;
    height: 236.69px;
    position: relative;
  `,
  imgEspecialidade: css`
    box-sizing: border-box;
    width: 346.38px;
    height: 178px;
    background-size: cover;
    background-position: center;
    border: 2.8865px solid #000;
    border-radius: 46.184px;
    z-index: 0;
  `,
  retEspecialidade: css`
    width: 263.63px;
    height: 49.07px;
    background: #c5ebfe;
    border-radius: 46.184px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    z-index: 1;
  `,
  textEspecialidade: css`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 29.9791px;
    line-height: 36px;
    text-align: center;
    color: #000;
    z-index: 2;
  `
}))
