import SwiftUI

struct QuoteNowButton: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 11)
            .foregroundColor(Color("UploadAJobGreen"))
            .frame(width: 359, height: 56)
            .shadow(color: (Color("UploadAJobGreenGlow")), radius: 10, x: 0, y: 0)
            .overlay(
                VStack(alignment: .center, spacing: 0){
                    NavigationLink(destination: ListjobView()){
                    HStack{
                        Text("Quote Now")
                            .foregroundColor(.white)
                            .font(.custom("Poppins-SemiBold", size: 24))
                        Image (systemName: "plus.app.fill")
                            .resizable()
                            .frame(width: 19, height: 19, alignment: .center)
                            .foregroundColor(.white)
                    }
                    .frame(width: 319, height: 30, alignment: .center)
                    }
        }
    )
    }
}

struct QuoteNowButton_Previews: PreviewProvider {
    static var previews: some View {
        QuoteNowButton()
    }
}

