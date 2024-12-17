"use client"
import { redirect, useSearchParams, useRouter } from "next/navigation"
import { useUser, useProviders } from "../../utils/user"
import { CldImage, CldOgImage, CldUploadWidget } from "next-cloudinary"
import { signal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import { data } from "../../utils/axiosUrl"
import { useMutation } from "@tanstack/react-query"

const currentImg = signal("")
const isEditing = signal(false)
const userName = signal()
const Page = () => {
  useSignals()
  const paramsDetails = useSearchParams()
  const userID = paramsDetails.get("id")
  const paramName = paramsDetails.get("name")
  const { session, update } = useUser()
  const providers = useProviders()
  const router = useRouter()


  const handleUpdateSession = async () => {
    await update({
      ...session?.user,
      profilePic: currentImg.value || session?.user?.profilePic,
      name: userName.value || session?.user?.name,
    })
  }

  const editUser = async (editedUser) => {
    try {
      const response = await data.value.patch(`/api/profile_update/${userID}`, editedUser)
      if (userID) {
        return response
      }
      return
    } catch (err) {
      console.log(err)
    }
  }

  const editMutation = useMutation({
    mutationKey: "edit",
    mutationFn: editUser,
  })

  const editName = (e) => {
    userName.value = e.target.value
  }
  const confirmEdit = () => {
    editMutation.mutate({
      name: userName.value || session?.user?.name,
    })
    handleUpdateSession()
  }
  const cancelEdit = () => {
    isEditing.value = false
    router.back()
  }

  if (!session?.user) {
  <div> Log TF in </div>
  }
  return (
    <>
      <div className="profile-container">
        <section>
          <div>Welcome {session?.user?.name}, you can edit your profile here</div>
          <div className="profile-picture">
            {session?.user && (
              <CldUploadWidget
                options={{ sources: ["local", "camera", "google_drive"] }}
                uploadPreset="ngb_cloudinary_app"
                onSuccess={(results) => {
                  currentImg.value = results.info.public_id
                  handleUpdateSession()
                  editMutation.mutate({
                    image: currentImg.value,
                  })
                }}
              >
                {({ open }) => {
                  function handleOnClick() {
                    currentImg.value = ""
                    open()
                  }
                  return (
                    <div
                      onClick={handleOnClick}
                      className="edit-btn"
                    >
                      <img src="../edit.svg" />
                    </div>
                  )
                }}
              </CldUploadWidget>
            )}
            {session?.user && !session?.user?.profilePic && (
              <img
                src="../icons8-user-100 (1).png"
                alt="profile_img"
              />
            )}
            {session?.user && session?.user?.profilePic && (
              <CldImage
                width="100"
                height="100"
                alt="profile_img"
                src={session?.user?.profilePic}
                crop={{
                  type: "auto",
                  source: true,
                }}
              />
            )}
          </div>
        </section>

        <section>
          <div className="profile-details">
            <label
              onClick={() => (isEditing.value = !isEditing.value)}
              htmlFor="username"
              className="user-label"
            >
              <span>Username</span>
              <img
                src="../edit.svg"
                alt="edit-icon"
              />{" "}
            </label>
            <input
              onChange={editName}
              type="text"
              id="username"
              value={userName.value}
              placeholder={session?.user?.name}
              name="username"
              disabled={!isEditing.value}
            />

            <div className="edit-choice">
              <img
                onClick={confirmEdit}
                src="../confirm.svg"
                alt="confirm-icon"
              />
              <img
                onClick={cancelEdit}
                src="../cancel.svg"
                alt="cancel icon"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Page
