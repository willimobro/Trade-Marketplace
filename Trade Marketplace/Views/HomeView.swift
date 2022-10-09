// fix shadows
// fix spacing
// 



import SwiftUI

struct HomeView: View {
    @State var background1: CGFloat = 0
    var body: some View {
        NavigationView  {
        ZStack(){
            HomeBackground(background: $background1)
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
                            .overlay(
                                GeometryReader { proxy in
                                    Color.clear.preference(key: TabPreferenceKey.self, value: proxy.frame(in: .global).minY)
                                     
                                }
                            )
                            .onPreferenceChange(TabPreferenceKey.self)  {
                                value in background1 = value
                            }
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




//struct HomeView_Previews: PreviewProvider {
//    static var previews: some View {
//        HomeView()
//    }
//}
