import {image} from "../../../../utils/images";
import {settingStore} from "../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const Loading = () => {
    return (
        <>
            {
                settingStore.loading && (
                <>
                    <div className="w-full h-[100vh] fixed top-0 left-0 bg-gray-700 opacity-70" style={{zIndex: 100}}/>
                    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50px] h-[50px]"
                         style={{zIndex: "1000"}}>
                        <img src={image.inExtension("/gifs/loading.gif")} alt="loading" className="w-[50px] h-[50px]"/>
                    </div>
                </>
            )
        }
        </>
    )
}

export default observer(Loading)