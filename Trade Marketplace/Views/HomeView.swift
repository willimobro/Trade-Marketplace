// fix shadows
// fix spacing
// 













import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationView  {
        ZStack(){
            HomeBackground()
                VStack(spacing: 10){
                    ScrollView(.vertical){
                    Navigatior()
                    UploadJobButton()
            HStack{
                Text("Browse")
                        .font(.custom("Poppins-SemiBold", size: 28))
                        .fontWeight(.semibold)
                        .frame(width: 321, height: 36, alignment: .leading)
                        .foregroundColor(.white)
                }
                ScrollView(.horizontal){
                    HStack(spacing: 19){
                            // change to amount in array sometime
                            Rectangle()
                            .frame(width: 20, height: 170)
                            .opacity(0)
                            Categorys()
                            Categorys()
                            Categorys()
                        Categorys()
                        Categorys()
                        Categorys()
                        Categorys()
                        Categorys()
                        Categorys()
                            
                        }   .frame(height: 200, alignment: .leading)
                }
                ContentHome()
                    }
                    
                    }
                .edgesIgnoringSafeArea(.bottom)
            }
        }.navigationBarBackButtonHidden(true)
            .navigationBarTitleDisplayMode(.inline)
               .navigationBarHidden(true)
    }
}




struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
