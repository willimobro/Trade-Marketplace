import SwiftUI

struct BackgroundLogo_Main: View {
    var body: some View {
        ZStack{
            VStack{
            HStack(spacing: 7.0){
            LogoView()
                .frame(width: 25.78, height: 42.67)
                .foregroundColor(Color("logogreen"))
                .padding(.leading, 35)
                Text("TRADE MARKETPLACE")
                    .font(.subheadline)
                .foregroundColor(.white)
                .fontWeight(.bold)
                .frame(width: 145, height: 42.46, alignment: .topLeading)
                
            Spacer()
            
                
            }
        }
            
        .frame(maxHeight: .infinity, alignment: .topLeading)
            LogoView()
                .ignoresSafeArea()
                .foregroundColor(Color("logogreen"))
                .blendMode(.screen)
                .opacity(0.2)
                .frame(width: 419, height: 693.55, alignment: .top)
                .padding(.top, -500)
                // align logo a bit higher
        
        }.background(Color("CanvasColor"))
    }
                         
}
struct BackgroundLogo_Secondary_Previews: PreviewProvider {
    static var previews: some View {
        BackgroundLogo_Main()
    }
}
